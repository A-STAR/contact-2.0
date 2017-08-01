import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form-control.interface';

import { AddressService } from '../address.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html'
})
export class AddressCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  private id: number;
  private addressId: number;

  controls: Array<IDynamicFormItem> = null;
  address: any;

  constructor(
    private addressService: AddressService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    // TODO(d.maltsev): uis there a better way to get route params?
    this.id = (route.params as any).value.id || null;
    this.addressId = (route.params as any).value.addressId || null;

    Observable.combineLatest(
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_ADDRESS_TYPE),
      this.userPermissionsService.has('ADDRESS_EDIT'),
      this.userPermissionsService.has('ADDRESS_COMMENT_EDIT'),
      // TODO(d.maltsev): pass entity type
      this.addressService.fetch(18, this.id, this.addressId)
    )
    .take(1)
    .subscribe(([ opts, canEdit, canEditComment, address ]) => {
      this.controls = [
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
            { label: 'widgets.address.card.typeCode', controlName: 'typeCode', type: 'select', required: true, opts, disabled: !canEdit },
            { label: 'widgets.address.card.comment', controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
            { label: 'widgets.address.card.isResidence', controlName: 'isResidence', type: 'checkbox', disabled: !canEdit },
          ] as Array<IDynamicFormItem>
        },
      ];
      this.address = address;
    });
  }

  public onSubmit(): void {
    const { value } = this.form;
    const data = {
      ...value,
      typeCode: Array.isArray(value.typeCode) ? value.typeCode[0].value : value.typeCode
    }
    this.addressService.update(18, this.id, this.addressId, data).subscribe();
  }

  public onBack(): void {
    console.log('back');
  }

  public get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}
