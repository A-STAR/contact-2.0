import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';

import { AddressGridComponent } from './address/address.component';
import { MiscComponent } from './misc/misc.component';
import { PhoneGridComponent } from './phone/phone.component';

@Component({
  selector: 'app-register-contact-dialog',
  templateUrl: './register-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterContactComponent {
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(AddressGridComponent) addressTab: AddressGridComponent;
  @ViewChild(MiscComponent) miscTab: MiscComponent;
  @ViewChild(PhoneGridComponent) phoneTab: PhoneGridComponent;

  constructor(
    private debtorService: DebtorService,
  ) {}

  entityType = 18;

  readonly entityId$: Observable<number> = this.debtorService.debtorId$;

  readonly canRegisterPhones$: Observable<boolean> = this.debtorService.canRegisterIncomingCalls$;

  readonly canRegisterAddresses$: Observable<boolean> = this.debtorService.canRegisterAddressVisits$;

  readonly canRegisterMisc$: Observable<boolean> = this.debtorService.canRegisterSpecialOrOfficeVisit$;

  onAddressAction(contactId: number): void {
    this.submit.emit({ contactType: 3, contactId });
  }

  onPhoneAction(contactId: any): void {
    this.submit.emit({ contactType: 1, contactId });
  }

  onSpecialAction(): void {
    this.submit.emit({ contactType: 7, contactId: 0 });
  }

  onOfficeVisitAction(): void {
    this.submit.emit({ contactType: 8, contactId: 0 });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
