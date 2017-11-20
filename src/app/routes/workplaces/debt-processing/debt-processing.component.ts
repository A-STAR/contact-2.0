import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-debt-processing',
  templateUrl: './debt-processing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtProcessingComponent {
  static COMPONENT_NAME = 'DebtProcessingComponent';
}
