import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-debtor-general-information-addresses',
  templateUrl: './debtor-general-information-addresses.component.html'
})
export class DebtorGeneralInformationAddressesComponent {
  @Input() personId: number;
}
