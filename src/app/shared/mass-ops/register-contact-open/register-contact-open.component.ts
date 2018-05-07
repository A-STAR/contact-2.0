import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { IGridAction, ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
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
    private actionGridService: ActionGridService,
    private registerContactOpenService: RegisterContactOpenService
  ) { }

  ngOnInit(): void {
    const { debtId, personId } = this.actionGridService.buildRequest(this.actionData.payload);

    this.debtId = debtId;
    this.entityId = personId;

    this.entityTypeId = Number(this.actionGridService.getAddOption(this.actionData, 'entityTypeId', 0));
    this.campaignId = Number(this.actionGridService.getAddOption(this.actionData, 'campaignId', 0));
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
        contactType: 1,
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

  onCancel(): void {
    this.close.emit({ metadataAction: this.actionData });
  }

}
