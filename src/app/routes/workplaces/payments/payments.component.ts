import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-workplaces-payments',
  templateUrl: './payments.component.html',
})
export class PaymentsComponent {}
