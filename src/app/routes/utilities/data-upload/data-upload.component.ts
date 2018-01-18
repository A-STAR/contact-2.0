import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CellValueChangedEvent, ICellRendererParams } from 'ag-grid/main';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAGridAction, IAGridColumn } from '../../../shared/components/grid2/grid2.interface';
import { IMetadataAction } from '../../../core/metadata/metadata.interface';
import { IOpenFileResponse, ICell, ICellPayload, IDataResponse, IRow } from './data-upload.interface';

import { DataUploadService } from './data-upload.service';
import { GridService } from '../../../shared/components/grid/grid.service';

import { CellRendererComponent } from './cell-renderer.component';
import { Grid2Component } from '../../../shared/components/grid2/grid2.component';

import { DialogFunctions } from '../../../core/dialog';

import { isEmpty } from '../../../core/utils';

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
export class DataUploadComponent extends DialogFunctions implements OnInit {
  @ViewChild(Grid2Component) grid: Grid2Component;
  @ViewChild('fileInput') fileInput: ElementRef;

  actions: IMetadataAction[] = [
    { action: 'delete', params: [], addOptions: [], enabled: selection => !isEmpty(selection) },
  ];

  columns: IAGridColumn[];

  dialog: 'cancel' | 'errorLogPrompt';

  rows: any[];
  rowCount = 0;
  rowIdKey = 'id';

  private isFirstRequest = true;
  private queryParamsSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private dataUploadService: DataUploadService,
    private gridService: GridService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.queryParamsSub = this.route.queryParamMap
      .subscribe(params => {
        if (params) {
          const currencyId = params.get('currencyId');
          this.dataUploadService.uploader.parameter = currencyId;
        }
      });
  }

  get hasFile(): boolean {
    return !isEmpty(this.columns);
  }

  get hasErrors(): boolean {
    return this.rows && this.rows.reduce((acc, row) => acc || this.rowHasErrors(row), false);
  }

  get format(): number {
    return this.dataUploadService.format;
  }

  onFormatChange(format: number): void {
    this.dataUploadService.format = format;
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
        this.rows[row.id] = row;
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
      .flatMap(response => this.getColumnsFromResponse(response).map(columns => ({ response, columns })))
      .subscribe(({ response, columns }) => {
        this.columns = [ ...columns ];
        // The following line makes grid2 set `initialized = true` internally
        this.cdRef.detectChanges();
        this.rows = this.getRowsFromResponse(response);
        this.rowCount = this.rows.length;
        this.isFirstRequest = true;
        this.cdRef.markForCheck();
      });
  }

  onSaveClick(): void {
    this.dataUploadService.uploader
      .save()
      .subscribe(response => {
        const { processed, total } = response.massInfo;
        if (processed !== total) {
          this.setDialog('errorLogPrompt');
          this.cdRef.markForCheck();
        }
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
        this.columns = null;
        this.rows = [];
        this.rowCount = 0;
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
      default: return null;
    }
  }
}
