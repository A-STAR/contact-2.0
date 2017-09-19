import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-phone-grid-schedule-template',
  templateUrl: './phone-grid-schedule-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridScheduleTemplateComponent {
  @Input() debtId: number;
  @Input() personId: number;
  @Input() phoneId: number;
}
