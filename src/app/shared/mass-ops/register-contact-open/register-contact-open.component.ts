import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridAction, ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DebtService } from '@app/core/debt/debt.service';
import { RegisterContactOpenService } from './register-contact-open.service';

import { AddressGridComponent } from './address/address.component';
import { MiscComponent } from './misc/misc.component';
import { PhoneGridComponent } from './phone/phone.component';

@Component({
  selector: 'app-open-register-contact',
  templateUrl: './register-contact-open.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterContactOpenComponent implements OnInit {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  @ViewChild(AddressGridComponent) addressTab: AddressGridComponent;
  @ViewChild(MiscComponent) miscTab: MiscComponent;
  @ViewChild(PhoneGridComponent) phoneTab: PhoneGridComponent;

  entityTypeId: number;
  entityId: number;
  debtId: number;
  campaignId: number;

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private debtService: DebtService,
    private registerContactOpenService: RegisterContactOpenService
  ) { }

  ngOnInit(): void {
    const { debtId, personId } = this.actionGridFilterService.buildRequest(this.actionData.payload);

    this.debtId = debtId;
    this.entityId = personId;

    this.entityTypeId = Number(this.actionGridFilterService.getAddOption(this.actionData, 'entityTypeId', 0));
    this.campaignId = Number(this.actionGridFilterService.getAddOption(this.actionData, 'campaignId', 0));
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
    this.registerContactOpenService.registerContactAction$.next(
      {
        contactType: 3,
        contactId,
        debtId: this.debtId,
        personId: this.entityId,
        campaignId: this.campaignId
      }
    );
    this.close.emit();
  }

  onPhoneAction(contactId: any): void {
    this.registerContactOpenService.registerContactAction$.next(
      {
        contactType: 2,
        contactId,
        debtId: this.debtId,
        personId: this.entityId,
        campaignId: this.campaignId
      }
    );
    this.close.emit();
  }

  onSpecialAction(): void {
    this.registerContactOpenService.registerContactAction$.next(
      {
        contactType: 7,
        contactId: 0,
        debtId: this.debtId,
        personId: this.entityId,
        campaignId: this.campaignId
      }
    );
    this.close.emit();
  }

  onOfficeVisitAction(): void {
    this.registerContactOpenService.registerContactAction$.next(
      {
        contactType: 8,
        contactId: 0,
        debtId: this.debtId,
        personId: this.entityId,
        campaignId: this.campaignId
      }
    );
    this.close.emit();
  }

  onCancel(): void {
    this.close.emit({ metadataAction: this.actionData });
  }

}
