import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { IAGridColumn } from '../../../shared/components/grid2/grid2.interface';

import { IMetadataAction } from '../../../core/metadata/metadata.interface';

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

  actions: IMetadataAction[] = [
    { action: 'foo', params: [], addOptions: [] },
  ];

  columns: IAGridColumn[] = [
    { colId: 'id', dataType: 1, label: 'Id' },
    { colId: 'name', dataType: 1, label: 'Name' },
  ];

  rows = [];
  rowCount = 0;
  rowIdKey = 'id';

  onRequest(): void {
    //
  }

  onSelect(): void {
    //
  }

  onDblClick(): void {
    //
  }

  onAction(): void {
    //
  }
}
