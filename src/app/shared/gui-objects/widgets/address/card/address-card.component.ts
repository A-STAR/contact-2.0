import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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

  address$ = new BehaviorSubject<IAddress>(null);
  group$;

  constructor(
    private addressService: AddressService,
    private contentTabService: ContentTabService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    if (this.addressId) {
      this.addressService.fetch(18, this.id, this.addressId).subscribe(address => this.address$.next(address));
    }

    this.group$ = Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_ADDRESS_TYPE),
      this.addressId ? this.userPermissionsService.has('ADDRESS_EDIT') : Observable.of(true),
      this.addressId ? this.userPermissionsService.has('ADDRESS_COMMENT_EDIT') : Observable.of(true),
      this.address$,
    )
    .map(([ options, canEdit, canEditComment, address ]) => {
      return address && address.isText
        ? this.buildShortControls(options, canEdit, canEditComment)
        : this.buildFullControls(options, canEdit, canEditComment);
    })
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
            { type: 'text', name: 'postalCode', disabled: !canEdit },
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
                { type: 'text', name: 'country', disabled: !canEdit },
                { type: 'text', name: 'region', disabled: !canEdit },
                { type: 'text', name: 'area', disabled: !canEdit },
                { type: 'text', name: 'city', disabled: !canEdit },
                { type: 'text', name: 'settlement', disabled: !canEdit },
                { type: 'text', name: 'cityDistrict', disabled: !canEdit },
                { type: 'text', name: 'street', disabled: !canEdit },
                { type: 'text', name: 'house', disabled: !canEdit },
                { type: 'text', name: 'building', disabled: !canEdit },
                { type: 'text', name: 'flat', disabled: !canEdit },
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
            { type: 'select', name: 'typeCode', options, required: true, disabled: !canEdit },
            { type: 'textarea', name: 'comment', disabled: !canEdit && !canEditComment },
            { type: 'checkbox', name: 'isResidence', disabled: !canEdit },
          ]
        },
      ]
    } as IDynamicFormGroup;
  }

  private buildShortControls(options: Array<IOption>, canEdit: boolean, canEditComment: boolean): IDynamicFormGroup {
    return {
      type: 'group',
      name: 'rootGroup',
      translationKey: 'widgets.address.card',
      children: [
        { name: 'typeCode', type: 'select', required: true, options, disabled: !canEdit },
        { name: 'fullAddress', type: 'text', required: true, disabled: !canEdit },
        { name: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
        { name: 'isResidence', type: 'checkbox', disabled: !canEdit },
      ]
    } as IDynamicFormGroup;
  }
}
