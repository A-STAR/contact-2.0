import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { IAGridColumn } from '../../../shared/components/grid2/grid2.interface';
import { IMetadataAction } from '../../../core/metadata/metadata.interface';
import { IOpenFileResponse } from './data-upload.interface';

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
        dataType: column.typeCode,
        label: column.name,
      }));
  }

  private getRowsFromResponse(response: IOpenFileResponse): any[] {
    return response.rows
      .sort((a, b) => a.id - b.id)
      .map(row => row.cells.reduce((acc, cell, i) => {
        return {
          ...acc,
          [i]: cell.value,
        };
      }, {}));
  }
}
