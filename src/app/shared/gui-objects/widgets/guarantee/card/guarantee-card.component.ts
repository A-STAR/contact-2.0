import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDynamicFormGroup } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IGuaranteeContract } from '../guarantee.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { GuaranteeService } from '../guarantee.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';
import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('widgets.guaranteeContract.grid');

@Component({
  selector: 'app-guarantee-card',
  templateUrl: './guarantee-card.component.html'
})
export class GuaranteeCardComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private routeParams = (<any>this.route.params).value;
  // private personId = this.routeParams.personId || null;
  private contractId = this.routeParams.contractId || null;
  private debtId = this.routeParams.debtId || null;

  controls: IDynamicFormGroup[] = null;
  contract: IGuaranteeContract;

  constructor(
    private contentTabService: ContentTabService,
    private guaranteeService: GuaranteeService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
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
            { label: labelKey('contractNumber'), controlName: 'contractNumber',  type: 'text', required: true },
            { label: labelKey('contractStartDate'), controlName: 'contractStartDate', type: 'datepicker', },
            { label: labelKey('contractEndDate'), controlName: 'contractEndDate', type: 'datepicker', },
            {
              label: labelKey('contractTypeCode'), controlName: 'contractTypeCode',
              type: 'select', options: respTypeOpts, required: true
            },
            { label: labelKey('comment'), controlName: 'comment', type: 'textarea', },
          ]
        },
      ];
      this.controls = controls.map(control => canEdit ? control : { ...control, disabled: true }) as IDynamicFormGroup[];
      this.contract = contract;
    });
  }

  ngOnInit(): void {
    // Set default value
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onBack(): void {
    this.contentTabService.back();
  }

  onSubmit(): void {
    const data = this.form.requestValue;
    const action = this.debtId
      ? this.guaranteeService.update(this.debtId, this.contractId, data)
      : this.guaranteeService.create(this.debtId, data);

    action.subscribe(() => {
      this.messageBusService.dispatch(GuaranteeService.MESSAGE_GUARANTOR_SAVED);
      this.onBack();
    });
  }
}
