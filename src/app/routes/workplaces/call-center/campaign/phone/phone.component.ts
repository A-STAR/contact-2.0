import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-call-center-phone',
  templateUrl: 'phone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneComponent {
  static COMPONENT_NAME = 'DebtorPhoneComponent';
}
