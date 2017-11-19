import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-call-center-address',
  templateUrl: 'address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
  static COMPONENT_NAME = 'DebtorAddressComponent';
}
