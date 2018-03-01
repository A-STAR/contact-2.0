import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridAction, ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DebtService } from '@app/core/debt/debt.service';

import { AddressGridComponent } from './address/address.component';
import { MiscComponent } from './misc/misc.component';
import { PhoneGridComponent } from './phone/phone.component';

@Component({
  selector: 'app-open-register-contact',
  templateUrl: './open-register-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterContactOpenComponent implements OnInit {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();
  @Output() submit = new EventEmitter<any>();

  @ViewChild(AddressGridComponent) addressTab: AddressGridComponent;
  @ViewChild(MiscComponent) miscTab: MiscComponent;
  @ViewChild(PhoneGridComponent) phoneTab: PhoneGridComponent;

  entityTypeId: number;
  entityId: number;
  debtId: number;

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private debtService: DebtService,
  ) { }

  ngOnInit(): void {
    const { debtId, personId } = this.actionGridFilterService.buildRequest(this.actionData.payload);

    this.entityTypeId = Number(this.actionGridFilterService.getAddOption(this.actionData, 'entityTypeId', 0));

    this.debtId = debtId;
    this.entityId = personId;
  }

  get canRegisterPhones$(): Observable<boolean> {
    return this.debtService.canRegisterIncomingCalls$;
  }

  get canRegisterAddresses$(): Observable<boolean> {
    return this.debtService.canRegisterAddressVisits$;
  }

  get canRegisterMisc$(): Observable<boolean> {
    return this.debtService.canRegisterSpecialOrOfficeVisit$;
  }

  onAddressAction(contactId: number): void {
    this.submit.emit({ contactType: 3, contactId });
  }

  onPhoneAction(contactId: any): void {
    this.submit.emit({ contactType: 2, contactId });
  }

  onSpecialAction(): void {
    this.submit.emit({ contactType: 7, contactId: 0 });
  }

  onOfficeVisitAction(): void {
    this.submit.emit({ contactType: 8, contactId: 0 });
  }

  onCancel(): void {
    this.close.emit();
  }

}
