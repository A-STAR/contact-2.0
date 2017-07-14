import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IDebtor, IDebtorGeneralInformation, IDebtorGeneralInformationPhone } from './debtor.interface';
import { IDynamicFormGroup } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';

import { DebtorService } from './debtor.service';

import { EntityBaseComponent } from '../../../../shared/components/entity/edit/entity.base.component';

@Component({
  selector: 'app-debtor',
  templateUrl: './debtor.component.html',
  styleUrls: ['./debtor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DebtorComponent extends EntityBaseComponent<IDebtor> implements OnDestroy {
  static COMPONENT_NAME = 'DebtorComponent';

  debtor: IDebtor;
  generalInformation: IDebtorGeneralInformation;
  generalInformationPhones: IDebtorGeneralInformationPhone [];
  selectedDebtorSub: Subscription;

  constructor(private debtorService: DebtorService) {
    super();

      this.selectedDebtorSub = debtorService.selectedDebtor.subscribe(debtor => {
        this.debtor = debtor;
        this.generalInformation = debtor ? debtor.generalInformation : null;
        this.generalInformationPhones = this.generalInformation ? this.generalInformation.phones : null;
      });
  }

  ngOnDestroy(): void {
    this.selectedDebtorSub.unsubscribe();
  }

  protected getControls(): IDynamicFormGroup[] {
    const controls = [
      {
        children: [
          {
            width: 1,
            label: 'debtor.id',
            controlName: 'id',
            type: 'number',
            required: true,
            disabled: true
          },
          {
            width: 2,
            label: 'debtor.lastName',
            controlName: 'lastName',
            type: 'text',
          },
          {
            width: 2,
            label: 'debtor.firstName',
            controlName: 'firstName',
            type: 'text',
          },
          {
            width: 1,
            label: 'debtor.middleName',
            controlName: 'middleName',
            type: 'text',
          },
          {
            width: 2,
            label: 'debtor.type',
            controlName: 'type',
            type: 'select',
            options: [
              // TODO(a.poterenko) STUB
              { value: 1, label: 'Physical person' },
              { value: 2, label: 'Juridical person' },
            ]
          },
          {
            width: 1,
            label: 'debtor.responsible',
            controlName: 'responsible',
            type: 'text',
          },
          {
            width: 1,
            label: 'debtor.reward',
            controlName: 'reward',
            type: 'number',
          },
        ]
      }
    ];

    return controls as IDynamicFormGroup[];
  }
}
