import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CellValueChangedEvent, ICellRendererParams } from 'ag-grid/main';
import { Observable } from 'rxjs/Observable';

import { IAGridAction, IAGridColumn } from '../../../shared/components/grid2/grid2.interface';
import { IMetadataAction } from '../../../core/metadata/metadata.interface';
import { IOpenFileResponse, ICell, ICellPayload, IDataResponse } from './payments-upload.interface';

import { PaymentsUploadService } from './payments-upload.service';
import { GridService } from '../../../shared/components/grid/grid.service';

import { Grid2Component } from '../../../shared/components/grid2/grid2.component';

import { DialogFunctions } from '../../../core/dialog';

import { isEmpty } from '../../../core/utils';

@Component({
  selector: 'app-payments-upload',
  templateUrl: './payments-upload.component.html',
  styleUrls: [ './payments-upload.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    PaymentsUploadService,
  ]
})
export class PaymentsUploadComponent extends DialogFunctions {
  static COMPONENT_NAME = 'PaymentsUploadComponent';

  @ViewChild(Grid2Component) grid: Grid2Component;
  @ViewChild('fileInput') fileInput: ElementRef;

  actions: IMetadataAction[] = [
    { action: 'delete', params: [], addOptions: [] },
  ];

  columns: IAGridColumn[];

  dialog: 'cancel' | 'errorLogPrompt';

  rows: any[];
  rowCount = 0;
  rowIdKey = 'id';

  private isFirstRequest = true;

  constructor(
    private cdRef: ChangeDetectorRef,
    private paymentsUploadService: PaymentsUploadService,
    private gridService: GridService,
  ) {
    super();
  }

  get hasFile(): boolean {
    return !isEmpty(this.columns);
  }

  get hasErrors(): boolean {
    return false;
    // TODO(d.maltsev): uncomment
    // return this.rows && this.rows.reduce((acc, row) => acc || this.rowHasErrors(row), false);
  }

  get format(): number {
    return this.paymentsUploadService.format;
  }

  onFormatChange(format: number): void {
    this.paymentsUploadService.format = format;
  }

  onRequest(): void {
    if (this.isFirstRequest) {
      this.isFirstRequest = false;
    } else {
      const params = this.grid.getRequestParams();
      this.paymentsUploadService
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
        this.paymentsUploadService
          .deleteRow(Number(id))
          .subscribe(() => this.onRequest());
        break;
    }
  }

  onCellValueChange(event: CellValueChangedEvent): void {
    const cell = this.getCell(event as any);
    const payload: ICellPayload = {
      rowId: event.data.id,
      cellId: cell.id,
      value: String(cell.value),
    };
    this.paymentsUploadService
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
    this.paymentsUploadService
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
    this.paymentsUploadService
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
    this.paymentsUploadService
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
    this.paymentsUploadService
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
      const colId = cell.column.getColId();
      return this.rows[rowIndex].cells[colId].statusCode;
    });
  }

  onNextCriticalCellClick(): void {
    this.grid.focusNextCell(cell => {
      const { rowIndex } = cell;
      const colId = cell.column.getColId();
      return this.rows[rowIndex].cells[colId].statusCode === 1;
    });
  }

  // private rowHasErrors(row: IRow): boolean {
  //   // TODO(d.maltsev): how to check for errors?
  //   return row.cells.reduce((acc, cell) => acc || !!cell.errorMsg, false);
  // }

  private getColumnsFromResponse(response: IOpenFileResponse): Observable<IAGridColumn[]> {
    const columns = response.columns
      .sort((a, b) => a.order - b.order)
      .map((column, i) => ({
        name: i.toString(),
        cellRenderer: (params: ICellRendererParams) => this.getCellRenderer(params),
        cellStyle: (params: ICellRendererParams) => this.getCellStyle(params),
        dataType: column.typeCode,
        dictCode: column.dictCode,
        editable: true,
        label: column.name,
        valueGetter: (params: ICellRendererParams) => this.getCellValue(params),
        valueSetter: (params: any) => this.setCellValue(params),
      }));
    return this.gridService.getColumns(columns, {});
  }

  private getRowsFromResponse(response: IDataResponse): any[] {
    return response.rows.sort((a, b) => a.id - b.id);
  }

  private getCellRenderer(params: ICellRendererParams): string {
    return `
      <div title="${this.getCell(params).errorMsg || ''}">
        ${params.valueFormatted}
      </div>
    `;
  }

  private getCellValue(params: ICellRendererParams): number | string {
    return this.getCell(params).value;
  }

  private setCellValue(params: any): void {
    this.getCell(params).value = params.newValue;
  }

  private getCellStyle(params: ICellRendererParams): Partial<CSSStyleDeclaration> {
    return {
      backgroundColor: this.getCellColorByStatusCode(this.getCell(params).statusCode),
    };
  }

  private getCell(params: ICellRendererParams): ICell {
    return params.data.cells[params.column.getColId()];
  }

  private getCellColorByStatusCode(code: number): string {
    switch (code) {
      case 1: return '#fdd';
      case 2: return '#efe';
      case 3: return '#eef';
      case 4: return '#eff';
      case 5: return '#fef';
      case 6: return '#ffe';
      default: return null;
    }
  }
}
