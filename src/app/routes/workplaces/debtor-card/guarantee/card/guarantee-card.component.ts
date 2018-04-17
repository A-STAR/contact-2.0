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

import { GuaranteeCardService } from './guarantee-card.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { MetadataFormComponent } from '@app/shared/components/form/metadata-form/metadata-form.component';

import { range } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-guarantee-card',
  templateUrl: 'guarantee-card.component.html',
})
export class GuarantorCardComponent {
  @ViewChild('guarantorForm') guarantorForm: MetadataFormComponent<any>;

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
        dictCode: UserDictionariesService.DICTIONARY_GUARANTOR_RESPONSIBILITY_TYPE,
        disabled: false,
        display: true,
        label: 'Тип ответственности',
        name: 'contractTypeCode',
        type: IMetadataFormControlType.SELECT,
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

  readonly guarantorFormConfig: IMetadataFormConfig = {
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

  readonly guarantor$ = this.guaranteeCardService.guarantor$;

  readonly isGuarantorFormDisabled$ = this.guarantor$.pipe(
    map(Boolean),
  );

  readonly edit$ = this.route.data.pipe(
    map(data => data.edit),
  );

  readonly showContractForm$ = this.route.data.pipe(
    map(data => data.showContractForm),
  );

  constructor(
    private guaranteeCardService: GuaranteeCardService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  onGuarantorFormClear(): void {
    this.guaranteeCardService.selectGuarantor(null);
    this.guarantorForm.formGroup.reset();
  }

  onSave(): void {
    this.onBack();
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    this.router.navigate([ `/app/workplaces/debtor-card/${debtId}` ]);
  }
}
