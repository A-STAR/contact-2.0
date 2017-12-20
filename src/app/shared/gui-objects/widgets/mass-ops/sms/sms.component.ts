import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mass-sms',
  templateUrl: 'sms.component.html'
})
export class SmsComponent {
  controls = [];

  onSubmit(): void {

  }

  onClose(): void {

  }
}
