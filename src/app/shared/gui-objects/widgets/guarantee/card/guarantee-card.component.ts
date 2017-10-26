import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IGuaranteeContract, IGuarantor } from '../guarantee.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { GuaranteeService } from '../guarantee.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { makeKey } from '../../../../../core/utils';

const label = makeKey('widgets.guaranteeContract.grid');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-guarantee-card',
  templateUrl: './guarantee-card.component.html'
})
export class GuaranteeCardComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private routeParams = (<any>this.route.params).value;
  private contractId = this.routeParams.contractId || null;
  private debtId = this.routeParams.debtId || null;
  private personId: number;

  controls: IDynamicFormGroup[] = null;
  contract: IGuaranteeContract;

  constructor(
    private contentTabService: ContentTabService,
    private guaranteeService: GuaranteeService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {

    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GUARANTOR_RESPONSIBILITY_TYPE),
      this.contractId
        ? this.userPermissionsService.has('GUARANTEE_EDIT')
        : this.userPermissionsService.has('GUARANTEE_ADD'),
      this.contractId ? this.guaranteeService.fetch(this.debtId, this.contractId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ respTypeOpts, canEdit, contract ]) => {
      const controls = [
        {
          title: 'widgets.guaranteeContract.title', collapsible: true,
          children: [
            { label: label('contractNumber'), controlName: 'contractNumber',  type: 'text', required: true },
            { label: label('contractStartDate'), controlName: 'contractStartDate', type: 'datepicker', },
            { label: label('contractEndDate'), controlName: 'contractEndDate', type: 'datepicker', },
            {
              label: label('contractTypeCode'), controlName: 'contractTypeCode',
              type: 'select', options: respTypeOpts, required: true
            },
            { label: label('comment'), controlName: 'comment', type: 'textarea', },
          ]
        },
      ];
      this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
      this.contract = contract;
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit && !!this.personId;
  }

  onGuarantorChanged(guarantor: IGuarantor): void {
    this.personId = guarantor.id;
  }

  onBack(): void {
    this.contentTabService.gotoParent(this.router, 2);
  }

  onSubmit(): void {
    const data = this.form.serializedUpdates;
    const action = this.personId
      ? this.guaranteeService.create(this.debtId, { ...data, personId: this.personId })
      : this.guaranteeService.update(this.debtId, this.contractId, data);

    action.subscribe(() => {
      this.guaranteeService.notify(GuaranteeService.MESSAGE_GUARANTEE_CONTRACT_SAVED);
      this.onBack();
    });
  }
}
