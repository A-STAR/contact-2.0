import { Component, Input } from '@angular/core';

import { IDebtorGeneralInformation, IDebtorGeneralInformationPhone } from '../debtor.interface';

import {
  IDynamicFormGroup
} from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';

@Component({
  selector: 'app-debtor-general-information',
  templateUrl: './debtor-general-information.component.html',
})
export class DebtorGeneralInformationComponent extends EntityBaseComponent<IDebtorGeneralInformation> {

  @Input() phones: IDebtorGeneralInformationPhone[];
  @Input() data: IDebtorGeneralInformation;

  constructor() {
    super();
  }

  protected getControls(): IDynamicFormGroup[] {
    const controls = [
      {
        title: 'debtor.generalInformationTab.generalInformation',
        width: 6,
        children: [
          {
            width: 4,
            children: [
              {
                label: 'debtor.generalInformationTab.birthDate',
                controlName: 'birthDate',
                type: 'datepicker',
                required: true
              },
              {
                label: 'debtor.generalInformationTab.company',
                controlName: 'company',
                type: 'text'
              },
              {
                label: 'debtor.generalInformationTab.position',
                controlName: 'position',
                type: 'select'
              },
              {
                label: 'debtor.generalInformationTab.income',
                controlName: 'income',
                type: 'number'
              },
              {
                label: 'debtor.generalInformationTab.citizenship',
                controlName: 'citizenship',
                type: 'text'
              }
            ]
          },
          {
            width: 4,
            children: [
              {
                label: 'debtor.generalInformationTab.sex',
                controlName: 'sex',
                type: 'select',
                options: [ { value: 1, label: 'default.sex.m' }, { value: 2, label: 'default.sex.w' } ]
              },
              {
                label: 'debtor.generalInformationTab.importance',
                controlName: 'importance',
                type: 'number'
              },
              {
                label: 'debtor.generalInformationTab.maritalStatus',
                controlName: 'maritalStatus',
                type: 'select',
                options: [
                  // TODO(a.poterenko) STUB
                  { value: 1, label: 'Single' },
                  { value: 2, label: 'Divorced' },
                  { value: 3, label: 'Civil marriage' },
                ]
              },
              {
                label: 'debtor.generalInformationTab.education',
                controlName: 'education',
                type: 'select',
                options: [
                  // TODO(a.poterenko) STUB
                  { value: 1, label: 'Elementary' },
                  { value: 2, label: 'Secondary' },
                  { value: 3, label: 'Higher' },
                ]
              },
              {
                label: 'debtor.generalInformationTab.email',
                controlName: 'email',
                type: 'text'
              },
            ]
          },
          {
            width: 4,
            children: [
              {
                label: 'debtor.generalInformationTab.stage',
                controlName: 'stage',
                type: 'select',
                disabled: true,
                options: [
                  // TODO(a.poterenko) STUB
                  { value: 1, label: 'Soft' },
                ]
              },
              {
                label: 'debtor.generalInformationTab.decency',
                controlName: 'decency',
                type: 'number'
              },
              {
                label: 'debtor.generalInformationTab.workplaceChecked',
                controlName: 'workplaceChecked',
                type: 'checkbox'
              }
            ]
          }
        ]
      },
      {
        title: 'debtor.generalInformationTab.passport',
        width: 6,
        children: [
          {
            children: [
              {
                width: 4,
                label: 'debtor.generalInformationTab.series',
                controlName: 'series',
                type: 'text'
              },
              {
                width: 4,
                label: 'debtor.generalInformationTab.number',
                controlName: 'number',
                type: 'text'
              },
              {
                width: 4,
                label: 'debtor.generalInformationTab.issueDate',
                controlName: 'issueDate',
                type: 'datepicker'
              }
            ]
          },
          {
            label: 'debtor.generalInformationTab.issuedBy',
            controlName: 'issuedBy',
            type: 'text'
          },
          {
            label: 'debtor.generalInformationTab.birthPlace',
            controlName: 'birthPlace',
            type: 'text'
          }
        ]
      }
    ];

    return controls as IDynamicFormGroup[];
  }
}

