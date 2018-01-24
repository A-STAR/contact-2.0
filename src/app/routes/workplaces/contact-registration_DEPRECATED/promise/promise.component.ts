import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

import { IDebt } from '../../../../core/debt/debt.interface';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IPromise, IPromiseFormData } from './promise.interface';
import { IPromiseLimit } from '../../../../shared/gui-objects/widgets/promise/promise.interface';

import { AccordionService } from '../../../../shared/components/accordion/accordion.service';
import { ContactRegistrationService } from '../contact-registration.service';
import { DebtService } from '../../../../core/debt/debt.service';
import { PromiseService } from '../../../../shared/gui-objects/widgets/promise/promise.service';
import { PromiseService as ContactPromiseService } from './promise.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { DialogFunctions } from '../../../../core/dialog';

import { minStrict, max } from '../../../../core/validators';
import { isEmpty, makeKey, round } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.promise');

@Component({
  selector: 'app-contact-registration-promise',
  templateUrl: './promise.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseComponent extends DialogFunctions implements OnInit {
  @Input() debtId: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];
  data: IPromiseFormData;
  dialog: 'confirm' | 'info' = null;

  private debt: IDebt;
  private limit: IPromiseLimit;

  constructor(
    private accordionService: AccordionService,
    private cdRef: ChangeDetectorRef,
    private contactPromiseService: ContactPromiseService,
    private contactRegistrationService: ContactRegistrationService,
    private debtService: DebtService,
    private promiseService: PromiseService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    combineLatest(
      this.contactRegistrationService.selectedNode$,
      this.debtService.fetch(null, this.debtId),
      this.promiseService.getPromiseLimit(this.debtId, false),
      this.canAddInsufficientAmount$,
    )
    .subscribe(([ node, debt, limit, canAddInsufficientAmount ]) => {
      this.debt = debt;
      this.limit = limit;
      if (node && isEmpty(node.children)) {
        const { promiseMode } = node.data;
        if (promiseMode === 3) {
          this.data = { ...this.data, amount: debt.debtAmount, percentage: 100 };
        } else if (promiseMode === 2) {
          this.data = { ...this.data, amount: this.minDebtAmount, percentage: limit.minAmountPercent };
        }
        this.controls = this.buildControls(promiseMode, canAddInsufficientAmount);
        this.cdRef.detectChanges();
      } else {
        this.controls = null;
      }
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  get minAmountPercent(): number {
    return this.limit.minAmountPercent;
  }

  onNextClick(): void {
    this.canAddInsufficientAmount$
      .pipe(first())
      .subscribe(canAddInsufficientAmount => {
        if (this.data.amount < this.minDebtAmount) {
          this.setDialog(canAddInsufficientAmount ? 'confirm' : 'info');
          this.cdRef.markForCheck();
        } else {
          this.submit({ isUnconfirmed: 0 });
        }
      });
  }

  onConfirm(): void {
    this.submit({ isUnconfirmed: 1 });
  }

  private submit(data: Partial<IPromise>): void {
    const { guid } = this.contactRegistrationService;
    const { percentage, ...rest } = this.form.serializedUpdates;
    this.contactPromiseService.create(this.debtId, guid, { ...data, amount: this.data.amount, ...rest })
      .subscribe(() => {
        this.accordionService.next();
        this.cdRef.markForCheck();
        this.closeDialog();
      });
  }

  private get canAddInsufficientAmount$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_INSUFFICIENT_AMOUNT_ADD');
  }

  private get minDebtAmount(): number {
    return this.limit.minAmountPercent * this.debt.debtAmount / 100;
  }

  private buildControls(promiseMode: number, canAddInsufficientAmount: boolean): IDynamicFormControl[] {
    const minDate = moment().toDate();
    const maxDate = this.limit.maxDays == null
      ? null
      : moment().add(this.limit.maxDays, 'day').toDate();
    return [
      {
        controlName: 'date',
        type: 'datepicker',
        minDate,
        maxDate,
        required: true,
      },
      {
        controlName: 'amount',
        type: 'number',
        validators: [
          minStrict(promiseMode === 2 && !canAddInsufficientAmount ? this.minDebtAmount : 0),
          max(this.debt.debtAmount),
        ],
        required: true,
        disabled: promiseMode === 3,
        onChange: event => this.onAmountChange(event, this.debt.debtAmount)
      },
      {
        controlName: 'percentage',
        type: 'number',
        validators: [
          minStrict(promiseMode === 2 && !canAddInsufficientAmount ? this.limit.minAmountPercent : 0),
          max(100),
        ],
        disabled: promiseMode === 3,
        onChange: event => this.onPercentageChange(event, this.debt.debtAmount)
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
