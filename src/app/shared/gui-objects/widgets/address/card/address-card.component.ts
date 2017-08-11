import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IAddress } from '../address.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form-control.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { AddressService } from '../address.service';
import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html'
})
export class AddressCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  // TODO(d.maltsev): is there a better way to get route params?
  private id = (this.route.params as any).value.id || null;
  private addressId = (this.route.params as any).value.addressId || null;

  controls: Array<IDynamicFormItem> = null;
  address: IAddress;

  constructor(
    private addressService: AddressService,
    private contentTabService: ContentTabService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_ADDRESS_TYPE),
      this.addressId ? this.userPermissionsService.has('ADDRESS_EDIT') : Observable.of(true),
      this.addressId ? this.userPermissionsService.has('ADDRESS_COMMENT_EDIT') : Observable.of(true),
      // TODO(d.maltsev): pass entity type
      this.addressId ? this.addressService.fetch(18, this.id, this.addressId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ options, canEdit, canEditComment, address ]) => {
      this.controls = address && address.isText
        ? this.buildShortControls(options, canEdit, canEditComment)
        : this.buildFullControls(options, canEdit, canEditComment);
      this.address = address;
    });
  }

  public onSubmit(): void {
    const action = this.addressId
      ? this.addressService.update(18, this.id, this.addressId, this.form.requestValue)
      : this.addressService.create(18, this.id, this.form.requestValue);

    action.subscribe(() => {
      this.messageBusService.dispatch(AddressService.MESSAGE_ADDRESS_SAVED);
      this.onBack();
    });
  }

  public onBack(): void {
    this.contentTabService.back();
  }

  public get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  private buildFullControls(options: Array<IOption>, canEdit: boolean, canEditComment: boolean): Array<IDynamicFormItem> {
    return [
      {
        width: 6,
        children: [
          { label: 'widgets.address.card.postalCode', controlName: 'postalCode', type: 'text' },
          { label: 'widgets.address.card.country', controlName: 'country', type: 'text' },
          { label: 'widgets.address.card.region', controlName: 'region', type: 'text' },
          { label: 'widgets.address.card.area', controlName: 'area', type: 'text' },
          { label: 'widgets.address.card.city', controlName: 'city', type: 'text' },
          { label: 'widgets.address.card.settlement', controlName: 'settlement', type: 'text' },
          { label: 'widgets.address.card.cityDistrict', controlName: 'cityDistrict', type: 'text' },
          { label: 'widgets.address.card.street', controlName: 'street', type: 'text' },
          { label: 'widgets.address.card.house', controlName: 'house', type: 'text' },
          { label: 'widgets.address.card.building', controlName: 'building', type: 'text' },
          { label: 'widgets.address.card.flat', controlName: 'flat', type: 'text' },
        ].map(control => canEdit ? control : { ...control, disabled: true }) as Array<IDynamicFormItem>
      },
      {
        width: 6,
        children: [
          { label: 'widgets.address.card.typeCode', controlName: 'typeCode', type: 'select', required: true, options, disabled: !canEdit },
          { label: 'widgets.address.card.comment', controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
          { label: 'widgets.address.card.isResidence', controlName: 'isResidence', type: 'checkbox', disabled: !canEdit },
        ]
      },
    ];
  }

  private buildShortControls(options: Array<IOption>, canEdit: boolean, canEditComment: boolean): Array<IDynamicFormItem> {
    return [
      { label: 'widgets.address.card.typeCode', controlName: 'typeCode', type: 'select', required: true, options, disabled: !canEdit },
      { label: 'widgets.address.card.fullAddress', controlName: 'fullAddress', type: 'text', required: true, disabled: !canEdit },
      { label: 'widgets.address.card.comment', controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
      { label: 'widgets.address.card.isResidence', controlName: 'isResidence', type: 'checkbox', disabled: !canEdit },    ];
  }
}
