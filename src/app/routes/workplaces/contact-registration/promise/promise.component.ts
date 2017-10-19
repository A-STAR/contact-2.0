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
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { minStrict, max } from '../../../../core/validators';
import { isEmpty, makeKey, round } from '../../../../core/utils';

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
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.contactRegistrationService.selectedNode$,
      this.debtService.fetch(null, this.debtId),
      this.promiseService.getPromiseLimit(this.debtId),
      this.userPermissionsService.has('PROMISE_INSUFFICIENT_AMOUNT_ADD'),
    )
    .subscribe(([ node, debt, limit, canAddInsufficientAmount ]) => {
      console.log(canAddInsufficientAmount);
      if (node && isEmpty(node.children)) {
        const { promiseMode } = node.data;
        if (promiseMode === 3) {
          this.data = { ...this.data, amount: debt.debtAmount, percentage: 100 };
        }
        this.controls = this.buildControls(promiseMode, debt, limit);
        this.cdRef.detectChanges();
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
    return [
      {
        controlName: 'date',
        type: 'datepicker',
        minDate,
        maxDate
      },
      {
        controlName: 'amount',
        type: 'number',
        validators: [
          minStrict(promiseMode === 2 ? limit.minAmountPercent * debt.debtAmount / 100.0 : 0),
          max(debt.debtAmount),
        ],
        disabled: promiseMode === 3,
        onChange: event => this.onAmountChange(event, debt.debtAmount)
      },
      {
        controlName: 'percentage',
        type: 'number',
        validators: [
          minStrict(promiseMode === 2 ? limit.minAmountPercent : 0),
          max(100),
        ],
        disabled: promiseMode === 3,
        onChange: event => this.onPercentageChange(event, debt.debtAmount)
      },
    ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];
  }

  private onAmountChange(event: Event, total: number): void {
    const { value } = event.target as HTMLInputElement;
    const amount = Number(value);
    this.setAmount(amount, 100.0 * amount / total);
  }

  private onPercentageChange(event: Event, total: number): void {
    const { value } = event.target as HTMLInputElement;
    const percentage = Number(value);
    this.setAmount(total * percentage / 100.0, percentage);
  }

  private setAmount(amount: number, percentage: number): void {
    this.data = { ...this.data, amount: round(amount, 2) || null, percentage: round(percentage, 2) || null };
    this.cdRef.markForCheck();
  }
}
