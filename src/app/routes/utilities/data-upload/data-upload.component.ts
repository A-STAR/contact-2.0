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

import { IAGridAction, IAGridColumn } from '@app/shared/components/grid2/grid2.interface';
import { IMetadataAction } from '@app/core/metadata/metadata.interface';
import { DataUploaders,
  IOpenFileResponse,
  ICell,
  ICellPayload,
  IDataResponse,
  IRow,
  ICellValue,
} from './data-upload.interface';
import { IOption } from '@app/core/converter/value-converter.interface';

import { DataUploadService } from './data-upload.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { LookupService } from '@app/core/lookup/lookup.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { CellRendererComponent } from './cell-renderer.component';
import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';
import { Grid2Component } from '@app/shared/components/grid2/grid2.component';

import { DialogFunctions } from '@app/core/dialog';
import { isEmpty, TYPE_CODES } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  providers: [DataUploadService],
  selector: 'app-data-upload',
  styleUrls: ['./data-upload.component.scss'],
  templateUrl: './data-upload.component.html',
})
export class DataUploadComponent extends DialogFunctions
  implements OnInit, OnDestroy {
  @ViewChild(Grid2Component) grid: Grid2Component;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('downloader') downloader: DownloaderComponent;

  actions: IMetadataAction[] = [
    {
      action: 'delete',
      params: [],
      addOptions: [],
      enabled: (_, __, row) => !!row,
    },
  ];

  columns: IAGridColumn[];
  uploaders: IOption[] = [];
  currencies: IOption[] = [];

  dialog: 'cancel' | 'errorLogPrompt';
  isCurrencySelected: boolean;
  hasAccess = true;

  rows: any[];
  rowCount = 0;
  rowIdKey = 'id';
  private static FORMAT_PERMISSION = 'LOAD_DATA_FROM_EXCEL_FORMAT_LIST';

  private uploadersOptionsSub: Subscription;
  private currencyOptionsSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataUploadService: DataUploadService,
    private gridService: GridService,
    private lookupService: LookupService,
    private notificationsService: NotificationsService,
    private userDictionariesService: UserDictionariesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.uploadersOptionsSub = this.userDictionariesService
      .getDictionaryAsOptionsWithPermission(
        UserDictionariesService.DICTIONARY_DATA_LOAD_FORMAT,
        DataUploadComponent.FORMAT_PERMISSION
      )
      .subscribe(options => {
        this.hasAccess = options && !!options.length;
        if (this.hasAccess) {
          // this will create corresponding uploader
          this.dataUploadService.format = options[0].value as DataUploaders;
          this.uploaders = options;
        } else {
          this.notificationsService.error('modules.dataUpload.errors.notAvailable').dispatch();
        }
        // reset previous loaded file
        this.resetFile();
        if (this.columns) {
          // reset previous grid
          this.resetGrid();
        }
        this.cdRef.markForCheck();
    });

    this.currencyOptionsSub = this.lookupService.lookupAsOptions('currencies')
      .subscribe(currencies => {
        this.currencies = currencies;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.uploadersOptionsSub) {
      this.uploadersOptionsSub.unsubscribe();
    }

    if (this.currencyOptionsSub) {
      this.currencyOptionsSub.unsubscribe();
    }
  }

  get hasFile(): boolean {
    return !isEmpty(this.columns);
  }

  get hasErrors(): boolean {
    return (
      this.rows &&
      this.rows.reduce((acc, row) => acc && this.rowHasErrors(row), true)
    );
  }

  get format(): number {
    return this.dataUploadService.format;
  }

  get currency(): number {
    return this.dataUploadService.uploader.parameter;
  }

  get errorFileUrl(): string {
    return this.dataUploadService.uploader && this.dataUploadService.uploader.getErrors();
  }

  get errorFileName(): string {
    return this.dataUploadService.uploader && this.dataUploadService.uploader.errorFileName;
  }

  onFormatChange(formatId: number): void {
    if (formatId != null) {
      this.dataUploadService.format = formatId;
      this.isCurrencySelected = formatId === DataUploaders.CURRENCY_RATE;
      if (this.isCurrencySelected) {
        this.dataUploadService.uploader.parameter = this.currencies[0].value;
      }
    }
  }

  onCurrencyChange(currencyId: number): void {
    if (this.dataUploadService.uploaderOfType(DataUploaders.CURRENCY_RATE)) {
      this.dataUploadService.uploader.parameter = currencyId;
    }
  }

  onRequest(): void {
    const params = this.grid.getRequestParams();
    this.dataUploadService.uploader
      .fetch(params)
      .subscribe(response => {
        this.rows = this.getRowsFromResponse(response);
        this.rowCount = this.rows.length;
        this.cdRef.markForCheck();
      });
  }

  onAction(event: IAGridAction): void {
    const { action } = event.metadataAction;
    switch (action) {
      case 'delete':
        const { id } = event.selection.node;
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
      value: this.dataUploadService.formatCellValue(
        this.findColumnType(cell),
        cell.value
      ),
    };
    this.dataUploadService.uploader.editCell(payload).subscribe(response => {
      const row = response && response.rows && response.rows[0];
      if (row) {
        // we have to change reference to the rows arr
        const rows = this.rows.slice();
        const rowIndex = rows.findIndex((_row => _row.id === row.id));
        if (rowIndex !== -1) {
          rows.splice(rowIndex, 1, row);
          this.rows = rows;
          this.cdRef.markForCheck();
        }
      }
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
        this.resetFile();
        return of(null);
      })
      .flatMap(
        response =>
          response
            ? this.getColumnsFromResponse(response).map(columns => ({
                response,
                columns,
              }))
            : of({ response: null, columns: null }),
      )
      .subscribe(({ response, columns }) => {
        if (response && columns) {
          this.columns = [...columns];
          this.cdRef.markForCheck();
        }
      });
  }

  onSaveClick(): void {
    this.dataUploadService.uploader.save().subscribe(response => {
      const { processed, total } = response.massInfo;
      if (processed !== total) {
        this.setDialog('errorLogPrompt');
      } else {
        // handles both successful and erroneous response
        this.resetFile();
        this.resetGrid();
      }
      this.cdRef.markForCheck();
    });
  }

  onErrorLogSubmit(): void {
    this.downloader.download();
    this.closeDialog();
    this.onRequest();
  }

  onErrorLogClose(): void {
    this.closeDialog();
    this.onRequest();
  }

  onCancelClick(): void {
    this.setDialog('cancel');
    this.cdRef.markForCheck();
  }

  onCancelSubmit(): void {
    this.dataUploadService.uploader.cancel().subscribe(() => {
      this.resetGrid();
      // TODO(d.maltsev): maybe reset form instead?
      this.resetFile();
      this.closeDialog();
      this.cdRef.markForCheck();
    });
  }

  onNextProblematicCellClick(): void {
    this.grid.focusNextCell(cell => {
      const { rowIndex } = cell;
      const columnId = cell.column.getColId();
      return this.rows[rowIndex]
        ? this.rows[rowIndex].cells.find(c => c.columnId === columnId)
            .statusCode
        : null;
    });
  }

  onNextCriticalCellClick(): void {
    this.grid.focusNextCell(cell => {
      const { rowIndex } = cell;
      const columnId = cell.column.getColId();
      return this.rows[rowIndex]
        ? this.rows[rowIndex].cells.find(c => c.columnId === columnId)
            .statusCode === 1
        : null;
    });
  }

  onErrorValueUpdate(rows: IRow[]): void {
    // do nothing if no row is selected
    if (this.grid.selectedNodes.length) {
      // we presume that changed rows are also currently selected ones
      const rowNodes = this.grid.selectedNodes.filter(row =>
        rows.includes(row.data),
      );
      // refresh grid manually to change cell's style
      // if changed rows not found in selected rows, refresh the whole grid
      // we need to force refresh in both cases, since row data is the same at this point
      this.grid.refreshCells(
        rowNodes && rowNodes.length
          ? { rowNodes, force: true }
          : { force: true },
      );
    }
  }

  private findColumnType(cell: ICell): TYPE_CODES {
    const col = this.columns.find(column => column.colId === cell.columnId);
    return col ? col.dataType : null;
  }

  private resetFile(): void {
    this.fileInput.nativeElement.value = '';
    this.dataUploadService.uploader.fileName = '';
  }

  private resetGrid(): void {
    this.columns = null;
    this.rows = [];
    this.rowCount = 0;
  }

  private rowHasErrors(row: IRow): boolean {
    return row.cells.reduce((acc, cell) => acc || !!cell.errorMsg, false);
  }

  private getColumnsFromResponse(
    response: IOpenFileResponse,
  ): Observable<IAGridColumn[]> {
    const columns = response.columns.map((column, i) => {
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

  private getCellValue(params: ICellRendererParams): ICellValue {
    return this.getCell(params).value;
  }

  private setCellValue(params: any): void {
    this.getCell(params).value = params.newValue;
  }

  private getCellStyle(
    params: ICellRendererParams,
  ): Partial<CSSStyleDeclaration> {
    const { statusCode } = this.getCell(params);
    return this.getCellStyleByStatusCode(statusCode);
  }

  private getCell(params: ICellRendererParams): ICell {
    const columnId = params.column.getColId();
    return params.data.cells.find(cell => cell.columnId === columnId);
  }

  private getCellStyleByStatusCode(code: number): Partial<CSSStyleDeclaration> {
    switch (code) {
      case 1:
        return { backgroundColor: '#ffe7e7', color: '#ff0000' };
      case 2:
        return { backgroundColor: '#f0f0f0', color: '#ff6600' };
      case 3:
        return { backgroundColor: '#ff6600', color: '#ffffff' };
      case 4:
        return { backgroundColor: '#ffffdd', color: '#000000' };
      case 5:
        return { backgroundColor: '#e0f0ff', color: '#00ccff' };
      case 6:
        return { backgroundColor: '#ddfade', color: '#339966' };
      // we have to return some style, otherwise it wont be changed
      // if a new style is not present (i.e. null), the last style is preserved
      default:
        return { backgroundColor: '#ffffff', color: '#000000' };
    }
  }
}
