import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators/map';

import {
  IContextByEntityMethod,
  IContextByValueBagMethod,
  IContextConfigItemType,
  IContextConfigOperator,
} from '@app/core/context/context.interface';

import {
  IMetadataFormConfig,
  IMetadataFormControlType,
  IMetadataFormTextControl,
  IFormContextConfigOperator,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';

import { PledgeCardService } from './pledge-card.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { MetadataFormComponent } from '@app/shared/components/form/metadata-form/metadata-form.component';

import { range } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-pledge-card',
  templateUrl: 'pledge-card.component.html',
})
export class PledgeCardComponent {
  @ViewChild('pledgorForm') pledgorForm: MetadataFormComponent<any>;
  @ViewChild('propertyForm') propertyForm: MetadataFormComponent<any>;

  readonly contractFormConfig: IMetadataFormConfig = {
    editable: true,
    items: [
      {
        disabled: false,
        display: true,
        label: 'Номер договора',
        name: 'contractNumber',
        type: IMetadataFormControlType.TEXT,
        validators: {
          required: true,
        },
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Начало',
        name: 'contractStartDate',
        type: IMetadataFormControlType.DATE,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Окончание',
        name: 'contractEndDate',
        type: IMetadataFormControlType.DATE,
        validators: {},
        width: 0,
      },
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

  readonly pledgorFormConfig: IMetadataFormConfig = {
    editable: true,
    items: [
      {
        dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE,
        disabled: false,
        display: true,
        label: 'Тип',
        name: 'typeCode',
        type: IMetadataFormControlType.SELECT,
        validators: {
          required: true,
        },
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Фамилия/Название',
        name: 'lastName',
        type: IMetadataFormControlType.TEXT,
        validators: {
          required: true,
        },
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
        disabled: false,
        display: {
          field: 'typeCode',
          operator: IFormContextConfigOperator.EQUALS,
          value: 1,
        },
        label: 'Место рождения',
        name: 'birthPlace',
        type: IMetadataFormControlType.TEXT,
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
        dictCode: UserDictionariesService.DICTIONARY_FAMILY_STATUS,
        disabled: false,
        display: {
          field: 'typeCode',
          operator: IFormContextConfigOperator.EQUALS,
          value: 1,
        },
        label: 'Семейное положение',
        name: 'familyStatusCode',
        type: IMetadataFormControlType.SELECT,
        validators: {},
        width: 0,
      },
      {
        dictCode: UserDictionariesService.DICTIONARY_EDUCATION,
        disabled: false,
        display: {
          field: 'typeCode',
          operator: IFormContextConfigOperator.EQUALS,
          value: 1,
        },
        label: 'Образование',
        name: 'educationCode',
        type: IMetadataFormControlType.SELECT,
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

  readonly propertyFormConfig: IMetadataFormConfig = {
    editable: true,
    items: [
      {
        disabled: false,
        display: true,
        label: 'Название',
        name: 'propertyName',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Тип имущества',
        name: 'propertyType',
        type: IMetadataFormControlType.SELECT,
        validators: {
          required: true,
        },
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Залоговая стоимость',
        name: 'pledgeValue',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Рыночная стоимость',
        name: 'marketValue',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Валюта',
        lookupKey: 'currencies',
        name: 'currencyId',
        type: IMetadataFormControlType.SELECT,
        validators: {
          // TODO(d.maltsev): add (`and`, `or`) operators to form context
          // TODO(d.maltsev): add `equals` method to form context
          required: true,
        },
        width: 0,
      },
    ],
    plugins: [],
  };

  readonly pledgor$ = this.pledgeCardService.pledgor$;

  readonly isPledgorFormDisabled$ = this.pledgor$.pipe(
    map(Boolean),
  );

  readonly property$ = this.pledgeCardService.property$;

  readonly isPropertyFormDisabled$ = this.property$.pipe(
    map(Boolean),
  );

  readonly edit$ = this.route.data.pipe(
    map(data => data.edit),
  );

  readonly showContractForm$ = this.route.data.pipe(
    map(data => data.showContractForm),
  );

  readonly showPledgorForm$ = this.route.data.pipe(
    map(data => data.showPledgorForm),
  );

  constructor(
    private pledgeCardService: PledgeCardService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  onPledgorFormClear(): void {
    this.pledgeCardService.selectPledgor(null);
    this.pledgorForm.formGroup.reset();
  }

  onPropertyFormClear(): void {
    this.pledgeCardService.selectProperty(null);
    this.propertyForm.formGroup.reset();
  }

  onSave(): void {
    this.onBack();
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    this.router.navigate([ `/app/workplaces/debtor-card/${debtId}` ]);
  }
}
