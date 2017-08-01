import { Component } from '@angular/core';

import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form-control.interface';

import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html'
})
export class AddressCardComponent {
  controls: Array<IDynamicFormItem> = null;
  data: any;

  constructor(private userDictionariesService: UserDictionariesService) {
    this.userDictionariesService
      .getDictionaryOptions(UserDictionariesService.DICTIONARY_ADDRESS_TYPE)
      .take(1)
      .subscribe(options => {
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
            ]
          },
          {
            width: 6,
            children: [
              { label: 'widgets.address.card.typeCode', controlName: 'typeCode', type: 'select', required: true, options },
              { label: 'widgets.address.card.comment', controlName: 'comment', type: 'textarea' },
              { label: 'widgets.address.card.isResidence', controlName: 'isResidence', type: 'checkbox' },
            ]
          },
        ];

        this.data = {};
      });

    userDictionariesService.preload([ UserDictionariesService.DICTIONARY_ADDRESS_TYPE ]);
  }
}
