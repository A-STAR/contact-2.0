import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { CellValueChangedEvent, ICellRendererParams } from 'ag-grid/main';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAGridAction, IAGridColumn } from '../../../shared/components/grid2/grid2.interface';
import { IMetadataAction } from '../../../core/metadata/metadata.interface';
import { DataUploaders, IOpenFileResponse, ICell, ICellPayload, IDataResponse, IRow,  } from './data-upload.interface';
import { IOption } from '@app/core/converter/value-converter.interface';

import { DataUploadService } from './data-upload.service';
import { GridService } from '../../../shared/components/grid/grid.service';

import { CellRendererComponent } from './cell-renderer.component';
import { Grid2Component } from '../../../shared/components/grid2/grid2.component';

import { DialogFunctions } from '../../../core/dialog';

import { isEmpty } from '../../../core/utils';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  providers: [
    DataUploadService,
  ],
  selector: 'app-data-upload',
  styleUrls: [ './data-upload.component.scss' ],
  templateUrl: './data-upload.component.html',
})
export class DataUploadComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(Grid2Component) grid: Grid2Component;
  @ViewChild('fileInput') fileInput: ElementRef;

  actions: IMetadataAction[] = [
    { action: 'delete', params: [], addOptions: [], enabled: selection => !isEmpty(selection) },
  ];

  columns: IAGridColumn[];
  uploaders: IOption[];

  dialog: 'cancel' | 'errorLogPrompt';

  isSelectVisible = true;

  rows: any[];
  rowCount = 0;
  rowIdKey = 'id';
  private static FORMAT_PERMISSION = 'LOAD_DATA_FROM_EXCEL_FORMAT_LIST';

  private isFirstRequest = true;
  private uploadersOptionsSub: Subscription;
  private queryParamsSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataUploadService: DataUploadService,
    private gridService: GridService,
    private userDictionariesService: UserDictionariesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.uploadersOptionsSub = this.userDictionariesService.getDictionaryAsOptionsWithPermission(
      UserDictionariesService.DICTIONARY_DATA_LOAD_FORMAT,
      DataUploadComponent.FORMAT_PERMISSION
    )
      .subscribe(options => {
        this.uploaders = options;
        this.dataUploadService.format = options[0].value as any;
        this.cdRef.markForCheck();
      });

    // set initial value
    this.dataUploadService.format = DataUploaders.SET_OPERATOR;

    this.queryParamsSub = this.dataUploadService
      .getPayload(DataUploadService.SELECTED_CURRENCY)
      .filter(Boolean)
      .subscribe(currencyId => {
        // format setter also creates new loader if it wasn't created
        this.dataUploadService.format = DataUploaders.CURRENCY_RATE;
        this.dataUploadService.uploader.parameter = currencyId;
        this.isSelectVisible = false;
        // reset previous loaded file
        this.fileInput.nativeElement.value = '';
        if (this.columns) {
          // reset previous grid
          this.resetGrid();
        }
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSub) {
       this.queryParamsSub.unsubscribe();
    }

    if (this.uploadersOptionsSub) {
       this.uploadersOptionsSub.unsubscribe();
    }
  }

  get hasFile(): boolean {
    return !isEmpty(this.columns);
  }

  get hasErrors(): boolean {
    return this.rows && this.rows.reduce((acc, row) => acc && this.rowHasErrors(row), true);
  }

  get format(): number {
    return this.dataUploadService.format;
  }

  onFormatChange(format: {value: number}[]): void {
    this.dataUploadService.format = format[0].value;
  }

  onRequest(): void {
    if (this.isFirstRequest) {
      this.isFirstRequest = false;
    } else {
      const params = this.grid.getRequestParams();
      this.dataUploadService.uploader
        .fetch(params)
        .subscribe(response => {
          this.rows = this.getRowsFromResponse(response);
          this.rowCount = this.rows.length;
          this.cdRef.markForCheck();
        });
    }
  }

  onAction(event: IAGridAction): void {
    const { action } = event.metadataAction;
    switch (action) {
      case 'delete':
        const { id } = event.params.node;
        this.dataUploadService.uploader
          .deleteRow(Number(id))
          .subscribe(() => this.onRequest());
        break;
    }
  }

  onCellValueChange(event: CellValueChangedEvent): void {
    const cell = this.getCell(event as any);
    const payload: ICellPayload = {
      rowId: event.data.id,
      columnId: cell.columnId,
      value: String(cell.value),
    };
    this.dataUploadService.uploader
      .editCell(payload)
      .subscribe(response => {
        const row = response.rows[0];
        const rows = this.rows.slice();
        rows.splice(row.id - 1, 1, row);
        this.rows = rows;
        this.cdRef.markForCheck();
      });
  }

  onFileOpenClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(): void {
    const file = (this.fileInput.nativeElement as HTMLInputElement).files[0];
    this.dataUploadService.uploader
      .openFile(file)
      .catch(() => {
        this.fileInput.nativeElement.value = '';
        return of(null);
      })
      .flatMap(response => response ? this.getColumnsFromResponse(response).map(columns => ({
            response,
            columns,
          })) : of({response: null, columns: null })
      )
      .subscribe(({ response, columns }) => {
        if (response && columns) {
          this.columns = [...columns];
          // The following line makes grid2 set `initialized = true` internally
          this.cdRef.detectChanges();
          this.rows = this.getRowsFromResponse(response);
          this.rowCount = this.rows.length;
          this.isFirstRequest = true;
          this.cdRef.markForCheck();
        }
      });
  }

  onSaveClick(): void {
    this.dataUploadService.uploader
      .save()
      .subscribe(response => {
        // TODO(i.lobanov): uncomment when ready on BE
        // const { processed, total } = response.massInfo;
        // if (processed !== total) {
        //   this.setDialog('errorLogPrompt');
        //   this.cdRef.markForCheck();
        // }
        this.setDialog('errorLogPrompt');
        this.cdRef.markForCheck();
      });
  }

  onErrorLogSubmit(): void {
    this.dataUploadService.uploader
      .getErrors()
      .subscribe(() => {
        this.closeDialog();
        this.cdRef.markForCheck();
      });
  }

  onCancelClick(): void {
    this.setDialog('cancel');
    this.cdRef.markForCheck();
  }

  onCancelSubmit(): void {
    this.dataUploadService.uploader
      .cancel()
      .subscribe(() => {
        this.resetGrid();
        // TODO(d.maltsev): maybe reset form instead?
        this.fileInput.nativeElement.value = '';
        this.closeDialog();
        this.cdRef.markForCheck();
      });
  }


  onNextProblematicCellClick(): void {
    this.grid.focusNextCell(cell => {
      const { rowIndex } = cell;
      const columnId = cell.column.getColId();
      return this.rows[rowIndex]
      ? this.rows[rowIndex].cells.find(c => c.columnId === columnId).statusCode
      : null;
    });
  }

  onNextCriticalCellClick(): void {
    this.grid.focusNextCell(cell => {
      const { rowIndex } = cell;
      const columnId = cell.column.getColId();
      return this.rows[rowIndex]
      ? this.rows[rowIndex].cells.find(c => c.columnId === columnId).statusCode === 1
      : null;
    });
  }

  onErrorValueUpdate(rows: IRow[]): void {
    // do nothing if no row is selected
    if (this.grid.selectedNodes.length) {
      // we presume that changed rows are also currently selected ones
      const rowNodes = this.grid.selectedNodes.filter(row => rows.includes(row.data));
      // refresh grid manually to change cell's style
      // if changed rows not found in selected rows, refresh the whole grid
      // we need to force refresh in both cases, since row data is the same at this point
      this.grid.refreshCells(rowNodes && rowNodes.length ? { rowNodes, force: true } : { force: true });
    }
  }

  private resetGrid(): void {
    this.columns = null;
    this.rows = [];
    this.rowCount = 0;
  }

  private rowHasErrors(row: IRow): boolean {
    return row.cells.reduce((acc, cell) => acc || !!cell.errorMsg, false);
  }

  private getColumnsFromResponse(response: IOpenFileResponse): Observable<IAGridColumn[]> {
    const columns = response.columns
      .map((column, i) => {
        return {
          name: column.id,
          // cellRenderer: (params: ICellRendererParams) => this.getCellRenderer(params),
          cellRendererFramework: CellRendererComponent,
          cellStyle: (params: ICellRendererParams) => this.getCellStyle(params),
          dataType: column.typeCode,
          dictCode: column.dictCode,
          editable: true,
          label: column.label,
          valueGetter: (params: ICellRendererParams) => this.getCellValue(params),
          valueSetter: (params: any) => this.setCellValue(params),
        };
      });
    return this.gridService.getColumns(columns, {});
  }

  private getRowsFromResponse(response: IDataResponse): any[] {
    return response.rows.sort((a, b) => a.id - b.id);
  }

  // private getCellRenderer(params: ICellRendererParams): string {
  //   const { errorMsg } = this.getCell(params);
  //   const value = params.valueFormatted === null ? '' : params.valueFormatted;
  //   return `
  //     <div title="${errorMsg ? 'errors.server.' + errorMsg : ''}">
  //       ${value}
  //     </div>
  //   `;
  // }

  private getCellValue(params: ICellRendererParams): number | string {
    return this.getCell(params).value;
  }

  private setCellValue(params: any): void {
    this.getCell(params).value = params.newValue;
  }

  private getCellStyle(params: ICellRendererParams): Partial<CSSStyleDeclaration> {
    const { statusCode } = this.getCell(params);
    return this.getCellStyleByStatusCode(statusCode);
  }

  private getCell(params: ICellRendererParams): ICell {
    const columnId = params.column.getColId();
    return params.data.cells.find(cell => cell.columnId === columnId);
  }

  private getCellStyleByStatusCode(code: number): Partial<CSSStyleDeclaration> {
    switch (code) {
      case 1: return { backgroundColor: '#ffe7e7', color: '#ff0000' };
      case 2: return { backgroundColor: '#f0f0f0', color: '#808080' };
      case 3: return { backgroundColor: '#f0f0f0', color: '#ff6600' };
      case 4: return { backgroundColor: '#ffffdd', color: '#000000' };
      case 5: return { backgroundColor: '#e0f0ff', color: '#00ccff' };
      case 6: return { backgroundColor: '#ddfade', color: '#339966' };
      // we have to return some style, otherwise it wont be changed
      // if a new style is not present (i.e. null), the last style is preserved
      default: return { backgroundColor: '#ffffff', color: '#000000' };
    }
  }
}
