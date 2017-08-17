import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IAddress } from '../address.interface';
import { IDynamicFormGroup } from '../../../../components/form/dynamic-form-2/dynamic-form-2.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { AddressService } from '../address.service';
import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicForm2Component } from '../../../../components/form/dynamic-form-2/dynamic-form-2.component';

import { oneOfGroupRequired } from '../../../../../core/validators';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html'
})
export class AddressCardComponent {
  @ViewChild('form') form: DynamicForm2Component;

  private id = (this.route.params as any).value.id || null;
  private addressId = (this.route.params as any).value.addressId || null;

  address: IAddress;

  constructor(
    private addressService: AddressService,
    private contentTabService: ContentTabService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    if (this.addressId) {
      this.addressService.fetch(18, this.id, this.addressId).subscribe(address => this.address = address);
    }
  }

  get group$(): Observable<IDynamicFormGroup> {
    return Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_ADDRESS_TYPE),
      this.addressId ? this.userPermissionsService.has('ADDRESS_EDIT') : Observable.of(true),
      this.addressId ? this.userPermissionsService.has('ADDRESS_COMMENT_EDIT') : Observable.of(true),
    )
    .map(([ options, canEdit, canEditComment ]) => this.buildFullControls(options, canEdit, canEditComment));
  }

  public onSubmit(): void {
    const action = this.addressId
      ? this.addressService.update(18, this.id, this.addressId, this.form.value)
      : this.addressService.create(18, this.id, this.form.value);

    action.subscribe(() => {
      this.messageBusService.dispatch(AddressService.MESSAGE_ADDRESS_SAVED);
      this.onBack();
    });
  }

  public onBack(): void {
    this.contentTabService.back();
  }

  public get canSubmit(): boolean {
    return this.form && this.form.isValid && this.form.isDirty;
  }

  private buildFullControls(options: Array<IOption>, canEdit: boolean, canEditComment: boolean): IDynamicFormGroup {
    return {
      type: 'group',
      name: 'rootGroup',
      children: [
        {
          type: 'group',
          name: 'bar',
          width: 6,
          translationKey: 'widgets.address.card',
          children: [
            { type: 'text', name: 'postalCode', required: true },
            {
              type: 'group',
              bordered: true,
              // TODO(d.maltsev): i18n
              label: 'Полный адрес',
              name: 'foo',
              translationKey: 'widgets.address.card',
              required: true,
              validators: oneOfGroupRequired,
              children: [
                { type: 'text', name: 'country' },
                { type: 'text', name: 'region' },
                { type: 'text', name: 'area' },
                { type: 'text', name: 'city' },
                { type: 'text', name: 'settlement' },
                { type: 'text', name: 'cityDistrict' },
                { type: 'text', name: 'street' },
                { type: 'text', name: 'house' },
                { type: 'text', name: 'building' },
                { type: 'text', name: 'flat' },
              ]
            },
          ]
        },
        {
          type: 'group',
          label: 'baz',
          name: 'baz',
          width: 6,
          translationKey: 'widgets.address.card',
          children: [
            { type: 'select', name: 'typeCode', options, required: true },
            { type: 'textarea', name: 'comment', required: true },
            { type: 'checkbox', name: 'isResidence' },
          ]
        },
      ]
    } as IDynamicFormGroup;
  }

  // private buildFullControls(options: Array<IOption>, canEdit: boolean, canEditComment: boolean): Array<IDynamicFormItem> {
  //   return [
  //     {
  //       width: 6,
  //       children: [
  //         { label: 'widgets.address.card.postalCode', controlName: 'postalCode', type: 'text' },
  //         { label: 'widgets.address.card.country', controlName: 'country', type: 'text' },
  //         { label: 'widgets.address.card.region', controlName: 'region', type: 'text' },
  //         { label: 'widgets.address.card.area', controlName: 'area', type: 'text' },
  //         { label: 'widgets.address.card.city', controlName: 'city', type: 'text' },
  //         { label: 'widgets.address.card.settlement', controlName: 'settlement', type: 'text' },
  //         { label: 'widgets.address.card.cityDistrict', controlName: 'cityDistrict', type: 'text' },
  //         { label: 'widgets.address.card.street', controlName: 'street', type: 'text' },
  //         { label: 'widgets.address.card.house', controlName: 'house', type: 'text' },
  //         { label: 'widgets.address.card.building', controlName: 'building', type: 'text' },
  //         { label: 'widgets.address.card.flat', controlName: 'flat', type: 'text' },
  //       ].map(control => canEdit ? control : { ...control, disabled: true }) as Array<IDynamicFormItem>
  //     },
  //     {
  //       width: 6,
  //       children: [
  //         { label: 'widgets.address.card.typeCode', controlName: 'typeCode', type: 'select', required: true, options,
  //             disabled: !canEdit },
  //         { label: 'widgets.address.card.comment', controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
  //         { label: 'widgets.address.card.isResidence', controlName: 'isResidence', type: 'checkbox', disabled: !canEdit },
  //       ]
  //     },
  //   ];
  // }

  // private buildShortControls(options: Array<IOption>, canEdit: boolean, canEditComment: boolean): Array<IDynamicFormItem> {
  //   return [
  //     { label: 'widgets.address.card.typeCode', controlName: 'typeCode', type: 'select', required: true, options, disabled: !canEdit },
  //     { label: 'widgets.address.card.fullAddress', controlName: 'fullAddress', type: 'text', required: true, disabled: !canEdit },
  //     { label: 'widgets.address.card.comment', controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
  //     { label: 'widgets.address.card.isResidence', controlName: 'isResidence', type: 'checkbox', disabled: !canEdit },    ];
  // }
}
