import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DataUploadService } from './data-upload.service';

@Component({
  selector: 'app-data-upload',
  templateUrl: './data-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DataUploadService,
  ]
})
export class DataUploadComponent {
  static COMPONENT_NAME = 'DataUploadComponent';
}
