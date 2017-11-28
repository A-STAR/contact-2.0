import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-data-upload',
  templateUrl: './data-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataUploadComponent {
  static COMPONENT_NAME = 'DataUploadComponent';
}
