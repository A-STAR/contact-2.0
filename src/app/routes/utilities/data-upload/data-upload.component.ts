import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CellValueChangedEvent, ICellRendererParams } from 'ag-grid/main';

import { IAGridAction, IAGridColumn } from '../../../shared/components/grid2/grid2.interface';
import { IMetadataAction } from '../../../core/metadata/metadata.interface';
import { IOpenFileResponse, ICell, ICellPayload, IDataResponse } from './data-upload.interface';

import { DataUploadService } from './data-upload.service';

import { Grid2Component } from '../../../shared/components/grid2/grid2.component';

@Component({
  selector: 'app-data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: [ './data-upload.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    DataUploadService,
  ]
})
export class DataUploadComponent {
  static COMPONENT_NAME = 'DataUploadComponent';

  @ViewChild(Grid2Component) grid: Grid2Component;
  @ViewChild('fileInput') fileInput: ElementRef;

  actions: IMetadataAction[] = [
    { action: 'delete', params: [], addOptions: [] },
  ];

  columns: IAGridColumn[];

  rows: any[];
  rowCount = 0;
  rowIdKey = 'id';

  private isFirstRequest = true;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataUploadService: DataUploadService,
  ) {}

  onRequest(): void {
    if (this.isFirstRequest) {
      this.isFirstRequest = false;
    } else {
      const params = this.grid.getRequestParams();
      this.dataUploadService
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
        this.dataUploadService
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
      value: cell.value,
    };
    this.dataUploadService
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
    this.dataUploadService
      .openFile(file)
      .subscribe(response => {
        this.columns = this.getColumnsFromResponse(response);
        // The following line makes grid2 set `initialized = true` internally
        this.cdRef.detectChanges();
        this.rows = this.getRowsFromResponse(response);
        this.rowCount = this.rows.length;
        this.isFirstRequest = true;
        this.cdRef.markForCheck();
      });
  }

  private getColumnsFromResponse(response: IOpenFileResponse): IAGridColumn[] {
    return response.columns
      .sort((a, b) => a.order - b.order)
      .map((column, i) => ({
        colId: i.toString(),
        cellRenderer: (params: ICellRendererParams) => this.getCellRenderer(params),
        cellStyle: (params: ICellRendererParams) => this.getCellStyle(params),
        dataType: column.typeCode,
        editable: true,
        label: column.name,
        valueGetter: (params: ICellRendererParams) => this.getCellValue(params),
        valueSetter: (params: any) => this.setCellValue(params),
      }));
  }

  private getRowsFromResponse(response: IDataResponse): any[] {
    return response.rows.sort((a, b) => a.id - b.id);
  }

  private getCellRenderer(params: ICellRendererParams): string {
    return `
      <div title="${this.getCell(params).errorMsg || ''}">
        ${params.getValue()}
      </div>
    `;
  }

  private getCellValue(params: ICellRendererParams): string {
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
      case 1: return '#eff';
      case 2: return '#fef';
      case 3: return '#ffe';
      case 4: return '#fee';
      case 5: return '#efe';
      case 6: return '#eef';
      default: return null;
    }
  }
}
