import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CellValueChangedEvent, ICellRendererParams } from 'ag-grid/main';

import { IAGridColumn } from '../../../shared/components/grid2/grid2.interface';
import { IMetadataAction } from '../../../core/metadata/metadata.interface';
import { IOpenFileResponse, ICell } from './data-upload.interface';

import { DataUploadService } from './data-upload.service';

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

  @ViewChild('fileInput') fileInput: any;

  actions: IMetadataAction[] = [
    { action: 'foo', params: [], addOptions: [] },
  ];

  columns: IAGridColumn[];

  rows: any[];
  rowCount = 0;
  rowIdKey = 'id';

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataUploadService: DataUploadService,
  ) {}

  onRequest(): void {
    //
  }

  onSelect(event: any): void {
    //
  }

  onDblClick(event: any): void {
    //
  }

  onAction(event: any): void {
    //
  }

  onCellValueChange(event: CellValueChangedEvent): void {
    // console.log(event);
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

  private getRowsFromResponse(response: IOpenFileResponse): any[] {
    return response.rows
      .sort((a, b) => a.id - b.id)
      .map(row => ({
        ...row,
        cells: row.cells.reduce((acc, cell, i) => ({ ...acc, [i]: cell }), {}),
      }));
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
