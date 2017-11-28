import { Component, Input, ViewChild } from '@angular/core';
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
  @Input() readOnly = false;

  @ViewChild('form') form: DynamicForm2Component;

  private routeParams = (<any>this.route.params).value;
  private queryParams = (<any>this.route.queryParams).value;
  private personId = this.routeParams.personId || null;
  private contactId = this.routeParams.contactId || null;
  private addressId = this.routeParams.addressId || null;
  private callCenter = this.queryParams.callCenter;

  address$ = new BehaviorSubject<IAddress>(null);
  group$: Observable<IDynamicFormGroup>;

  constructor(
    private addressService: AddressService,
    private contentTabService: ContentTabService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    // NOTE: on deper routes we should take the contactId
    this.personId = this.contactId || this.personId;

    if (this.addressId) {
      this.addressService.fetch(18, this.personId, this.addressId, this.callCenter)
        .subscribe(address => this.address$.next(address));
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
    });
  }

  onSubmit(): void {
    const action = this.addressId
      ? this.addressService.update(18, this.personId, this.addressId, this.callCenter, this.form.value)
      : this.addressService.create(18, this.personId, this.callCenter, this.form.value);

    action.subscribe(() => {
      this.messageBusService.dispatch(AddressService.MESSAGE_ADDRESS_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.contentTabService.back();
  }

  get canSubmit(): boolean {
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
            { type: 'text', name: 'postalCode', disabled: !canEdit || this.readOnly },
            {
              type: 'group',
              bordered: true,
              label: 'widgets.address.card.fullAddressLabel',
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
              ].map(item => ({ ...item, disabled: !canEdit || this.readOnly }))
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
            { type: 'select', name: 'typeCode', options, required: true, disabled: !canEdit || this.readOnly },
            { type: 'textarea', name: 'comment', disabled: !canEdit && !canEditComment || this.readOnly },
            { type: 'checkbox', name: 'isResidence', disabled: !canEdit || this.readOnly },
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
        { name: 'typeCode', type: 'select', required: true, options, disabled: !canEdit || this.readOnly },
        { name: 'fullAddress', type: 'text', required: true, disabled: !canEdit || this.readOnly },
        { name: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment || this.readOnly },
        { name: 'isResidence', type: 'checkbox', disabled: !canEdit || this.readOnly },
      ]
    } as IDynamicFormGroup;
  }
}
