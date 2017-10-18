import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import * as moment from 'moment';

import { IDebt } from '../../../../shared/gui-objects/widgets/debt/debt/debt.interface';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IPromiseLimit } from '../../../../shared/gui-objects/widgets/promise/promise.interface';

import { ContactRegistrationService } from '../contact-registration.service';
import { DebtService } from '../../../../shared/gui-objects/widgets/debt/debt/debt.service';
import { PromiseService } from '../../../../shared/gui-objects/widgets/promise/promise.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { min, max } from '../../../../core/validators';
import { isEmpty, makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.promise');

@Component({
  selector: 'app-contact-registration-promise',
  templateUrl: './promise.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseComponent implements OnInit {
  @Input() debtId: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];
  data = {};

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private debtService: DebtService,
    private promiseService: PromiseService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.contactRegistrationService.selectedNode$,
      this.debtService.fetch(null, this.debtId),
      this.promiseService.getPromiseLimit(this.debtId),
    )
    .subscribe(([ node, debt, limit ]) => {
      if (node && isEmpty(node.children)) {
        const { promiseMode } = node.data;
        if (promiseMode === 3) {
          this.data = { ...this.data, amount: debt.debtAmount, percentage: 100 };
        }
        this.controls = this.buildControls(promiseMode, debt, limit);
        this.cdRef.detectChanges();
        // TODO(d.maltsev): subscription
        // this.form.onCtrlValueChange('amount').subscribe(amount => {
        //   console.log('amount = ' + amount);
        //   this.data = { ...this.data, percentage: 50 };
        //   this.cdRef.markForCheck();
        // });
        // TODO(d.maltsev): subscription
        // this.form.onCtrlValueChange('percentage').subscribe(percentage => {
        //   console.log('percentage = ' + percentage);
        //   this.data = { ...this.data, amount: 5000 };
        //   this.cdRef.markForCheck();
        // });
      } else {
        this.controls = null;
      }
      this.cdRef.markForCheck();
    });
  }

  private buildControls(promiseMode: number, debt: IDebt, limit: IPromiseLimit): IDynamicFormControl[] {
    const minDate = moment().toDate();
    const maxDate = limit.maxDays == null
      ? null
      : moment().add(limit.maxDays, 'day').toDate();
    const amountValidators = promiseMode === 2
      ? [ min(limit.minAmountPercent * debt.debtAmount / 100), max(debt.debtAmount) ]
      : null;
    return [
      { controlName: 'date', type: 'datepicker', minDate, maxDate },
      { controlName: 'amount', type: 'number', disabled: promiseMode === 3, validators: amountValidators },
      { controlName: 'percentage', type: 'number', disabled: promiseMode === 3 },
    ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];
  }
}
