import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IPerson } from '../../../../../../../routes/workplaces/debt-processing/debtor/debtor.interface';

@Component({
  selector: 'app-phone-grid-schedule-template',
  templateUrl: './phone-grid-schedule-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridScheduleTemplateComponent {
  @Input() debtId: number;
  @Input() person: IPerson;
  @Input() phoneId: number;
}
