import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IAddress } from '@app/routes/workplaces/core/address/address.interface';
import { IDynamicFormGroup } from '@app/shared/components/form/dynamic-form-2/dynamic-form-2.interface';
import { IOption } from '@app/core/converter/value-converter.interface';

import { AddressService } from '@app/routes/workplaces/core/address/address.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicForm2Component } from '@app/shared/components/form/dynamic-form-2/dynamic-form-2.component';

import { oneOfGroupRequired } from '@app/core/validators';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html'
})
export class AddressCardComponent implements OnInit {
  @ViewChild('form') form: DynamicForm2Component;

  address$ = new BehaviorSubject<IAddress>(null);
  group$: Observable<IDynamicFormGroup>;

  private routeParamMap = this.route.snapshot.paramMap;
  private routeData = this.route.snapshot.data;

  private callCenter = this.routeData.callCenter;
  private entityKey = this.routeData.entityKey || 'entityId';

  private addressId = Number(this.routeParamMap.get('addressId'));
  private entityId = Number(this.routeParamMap.get(this.entityKey));

  constructor(
    private addressService: AddressService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    if (this.addressId) {
      this.addressService
        .fetch(18, this.entityId, this.addressId, this.callCenter)
        .subscribe(address => this.address$.next(address));
    }

    this.group$ = combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_ADDRESS_TYPE),
      this.addressId ? this.userPermissionsService.has('ADDRESS_EDIT') : of(true),
      this.addressId ? this.userPermissionsService.has('ADDRESS_COMMENT_EDIT') : of(true),
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
      ? this.addressService.update(18, this.entityId, this.addressId, this.callCenter, this.form.value)
      : this.addressService.create(18, this.entityId, this.callCenter, this.form.value);

    action.subscribe(() => {
      this.addressService.dispatchAction(AddressService.MESSAGE_ADDRESS_SAVED);
      this.onBack();
    });
  }

  onBack(): void {
    this.routingService.navigateToParent(this.route);
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
            { type: 'text', name: 'postalCode', disabled: !canEdit},
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
              ].map(item => ({ ...item, disabled: !canEdit }))
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
