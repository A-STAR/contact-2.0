import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import {
  IContextConfigItemType,
  IContextConfigOperator,
  IContextByEntityMethod,
  IContextByValueBagMethod,
} from '@app/core/context/context.interface';

import {
  IMetadataFormConfig,
  IMetadataFormControlType,
  IFormContextConfigOperator,
  IMetadataFormTextControl,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';

import { SelectPersonService } from '../select-person.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { MetadataFormComponent } from '@app/shared/components/form/metadata-form/metadata-form.component';

import { FilterObject, FilterOperatorType } from '@app/shared/components/grid2/filter/grid-filter';

import { range } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledge-card-select-person-filter',
  templateUrl: 'select-person-filter.component.html'
})
export class SelectPersonFilterComponent {
  @ViewChild(MetadataFormComponent) form: MetadataFormComponent<any>;

  constructor(
    private selectPersonService: SelectPersonService,
  ) {}

  readonly filterForm: IMetadataFormConfig = {
    editable: true,
    items: [
      {
        disabled: false,
        display: true,
        label: 'ID',
        name: 'id',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Фамилия/Название',
        name: 'lastName',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: {
          field: 'typeCode',
          operator: IFormContextConfigOperator.EQUALS,
          value: 1,
        },
        label: 'Имя',
        name: 'firstName',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: {
          field: 'typeCode',
          operator: IFormContextConfigOperator.EQUALS,
          value: 1,
        },
        label: 'Отчество',
        name: 'middleName',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
      {
        dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE,
        disabled: false,
        display: true,
        label: 'Тип',
        name: 'typeCode',
        type: IMetadataFormControlType.SELECT,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: {
          field: 'typeCode',
          operator: IFormContextConfigOperator.EQUALS,
          value: 1,
        },
        label: 'Дата рождения',
        name: 'birthDate',
        type: IMetadataFormControlType.DATE,
        validators: {},
        width: 0,
      },
      {
        dictCode: UserDictionariesService.DICTIONARY_GENDER,
        disabled: false,
        display: {
          field: 'typeCode',
          operator: IFormContextConfigOperator.EQUALS,
          value: 1,
        },
        label: 'Пол',
        name: 'genderCode',
        type: IMetadataFormControlType.SELECT,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Серия и номер паспорта',
        name: 'passportNumber',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
      ...range(1, 10).map(i => ({
        disabled: false,
        display: {
          type: IContextConfigItemType.GROUP,
          operator: IContextConfigOperator.AND,
          children: [
            {
              type: IContextConfigItemType.ENTITY,
              method: IContextByEntityMethod.IS_USED,
              value: 363 + i,
            },
            {
              type: IContextConfigItemType.CONSTANT,
              method: IContextByValueBagMethod.CONTAINS,
              value: [ 'Person.Individual.AdditionalAttribute.List', 363 + i ],
            }
          ],
        },
        label: `Строковый атрибут ${i}`,
        name: `stringValue${i}`,
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      }) as IMetadataFormTextControl),
      {
        disabled: false,
        display: true,
        label: 'Комментарий',
        name: 'comment',
        type: IMetadataFormControlType.TEXTAREA,
        validators: {},
        width: 0,
      },
    ],
    plugins: [],
  };

  onClear(): void {
    this.form.formGroup.reset();
    this.selectPersonService.quickFilters = null;
    this.selectPersonService.onRequest();
  }

  onSearch(): void {
    const { data } = this.form;
    const filters = FilterObject.create().and();

    Object.keys(data).forEach(prop => {
      const value = data[prop];
      if (value) {
        const operator: FilterOperatorType = /^\%.+\%$/.test(value)
          ? 'LIKE'
          : '==';
        const filter = FilterObject
          .create()
          .setOperator(operator)
          .setName(prop)
          .setValues(value);
        filters.addFilter(filter);
      }
    });

    this.selectPersonService.quickFilters = filters;
    this.selectPersonService.onRequest();
  }
}
