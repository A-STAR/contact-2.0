import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { IDebtorGeneralInformation, IDebtorGeneralInformationPhone } from '../debtor.interface';

import { IDynamicFormGroup } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { AddressGridComponent } from '../../../../../shared/gui-objects/widgets/address/grid/address-grid.component';
import { EmailGridComponent } from '../../../../../shared/gui-objects/widgets/email/grid/email-grid.component';
import { PhoneGridComponent } from '../../../../../shared/gui-objects/widgets/phone/grid/phone-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-general-information',
  templateUrl: './debtor-general-information.component.html',
})
export class DebtorGeneralInformationComponent extends EntityBaseComponent<IDebtorGeneralInformation> {

  @Input() data: IDebtorGeneralInformation;
  @Input() phones: IDebtorGeneralInformationPhone[];

  node: INode = {
    container: 'tabs',
    children: [
      {
        component: PhoneGridComponent,
        key: 'debtorPhoneGrid',
        title: 'debtor.information.phone.title'
      },
      {
        component: AddressGridComponent,
        key: 'debtorAddressGrid',
        title: 'debtor.information.address.title'
      },
      {
        component: EmailGridComponent,
        key: 'debtorEmailGrid',
        title: 'debtor.information.email.title'
      },
    ]
  };

  constructor() {
    super();
  }

  protected getControls(): IDynamicFormGroup[] {
    const controls = [
      {
        title: 'debtor.generalInformationTab.generalInformation',
        width: 12,
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
                options: [ { value: 1, label: 'default.sex.m' }, { value: 2, label: 'default.sex.f' } ]
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
                  // TODO(a.tymchuk) STUB
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
                  // TODO(a.tymchuk) STUB
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
                  // TODO(a.tymchuk) STUB
                  { value: 1, label: 'Soft' },
                  { value: 2, label: 'Hard' },
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
    ];

    return controls as IDynamicFormGroup[];
  }
}

