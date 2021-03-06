import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

import { Debt } from '@app/entities';
import { IDynamicFormControl, IDynamicFormDateControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IPromise, IPromiseLimit } from '../promise.interface';

import { PromiseService } from '../promise.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-promise-card',
  templateUrl: './promise-card.component.html'
})
export class PromiseCardComponent implements AfterViewInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() callCenter = false;
  @Input() readOnly = false;
  @Input() debtId: number;
  @Input() promiseId: number;

  private canAddInsufficientAmount: boolean;
  private debt: Debt;
  private promiseLimit: IPromiseLimit;
  private canAddInsufficientAmountSub: Subscription;
  private receiveDateTimeSub: Subscription;

  controls: IDynamicFormControl[] = [
    {
      label: 'widgets.promise.grid.promiseDate',
      controlName: 'promiseDate',
      type: 'datepicker',
      required: true
    },
    {
      label: 'widgets.promise.grid.promiseAmount',
      controlName: 'promiseAmount',
      type: 'number',
      required: true,
      markAsDirty: true,
      positive: true,
    },
    {
      label: 'widgets.promise.grid.receiveDateTime',
      controlName: 'receiveDateTime',
      type: 'datetimepicker',
      markAsDirty: true,
      required: true,
    },
    { label: 'widgets.promise.grid.comment', controlName: 'comment', type: 'textarea' },
  ].map(item => ({ ...item, disabled: this.readOnly } as IDynamicFormControl));

  dialog: string;
  promise: IPromise;

  constructor(
    private cdRef: ChangeDetectorRef,
    private promiseService: PromiseService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
    private workplacesService: WorkplacesService,
  ) {

    this.canAddInsufficientAmountSub = this.canAddInsufficientAmount$
      .subscribe(canAdd => this.canAddInsufficientAmount = canAdd);
  }

  ngAfterViewInit(): void {
    combineLatest(
      this.userPermissionsService.has('PROMISE_ADD'),
      this.promiseService.getPromiseLimit(this.debtId, this.callCenter),
      this.workplacesService.fetchDebt(this.debtId, this.callCenter),
      this.promiseId
        ? this.promiseService.fetch(this.debtId, this.promiseId, this.callCenter)
        : of(null),
    )
    .pipe(first())
    .subscribe(([
      canAdd, promiseLimit, debt, promise
    ]) => {
      this.promiseLimit = promiseLimit;
      this.debt = <Debt>debt;
      const { maxDays, minAmountPercent } = <IPromiseLimit>promiseLimit;
      // Calculate the minimum promise amount
      const minAmount = Math.round((minAmountPercent / 100) * debt.debtAmount * 100) / 100;
      const today = new Date();

      if (!promise) {
        const promiseDate = this.getControl('promiseDate') as IDynamicFormDateControl;
        promiseDate.maxDate = maxDays == null ? null : moment(today).add(maxDays, 'day').toDate();
        const receiveDate = this.getControl('receiveDateTime') as IDynamicFormDateControl;
        receiveDate.maxDate = today;
      }

      const disabledControls = promise
        ? this.controls
        : canAdd
          ? this.controls.filter(control => control.disabled)
          : this.controls;

      this.promise = promise ? promise : { receiveDateTime: today, promiseAmount: minAmount };

      this.form.disableControls(disabledControls);
      this.cdRef.markForCheck();
    });

    this.receiveDateTimeSub = this.form.onCtrlValueChange('receiveDateTime')
      .subscribe(value => {
        if (!value) { return; }
        const { maxDays } = this.promiseLimit;
        const today = new Date();
        const promiseCtrl = this.getControl('promiseDate') as IDynamicFormDateControl;

        // minDate should not be set if the operator want to record a past promise
        promiseCtrl.minDate = moment(value).isBefore(today, 'day') || !maxDays
          ? null
          : moment(value).toDate();
        promiseCtrl.maxDate = !maxDays
          ? null
          : moment(today).add(maxDays, 'day').toDate();
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.canAddInsufficientAmountSub.unsubscribe();
    this.receiveDateTimeSub.unsubscribe();
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  get minAmountPercent(): number {
    return this.promiseLimit && this.promiseLimit.minAmountPercent || 0;
  }

  get canAddInsufficientAmount$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_INSUFFICIENT_AMOUNT_ADD');
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  setDialog(dialog: string = null): void {
    this.dialog = dialog;
  }

  onCancel(): void {
    this.setDialog();
  }

  onConfirm(): void {
    const data = this.form.serializedUpdates;
    data.isUnconfirmed = 1;
    this.save(data);
  }

  onBack(): void {
    if (this.callCenter) {
      const campaignId = this.route.snapshot.paramMap.get('campaignId');
      if (campaignId) {
        this.routingService.navigate([ `/app/workplaces/call-center/${campaignId}/campaign` ]);
      }
    } else {
      const debtId = this.route.snapshot.paramMap.get('debtId');
      const debtorId = this.route.snapshot.paramMap.get('debtId');
      if (debtId && debtorId) {
        this.routingService.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
      }
    }
  }

  onSubmit(): void {
    const data = this.form.serializedUpdates;
    if (data.promiseAmount < this.debt.debtAmount * this.minAmountPercent / 100) {
      if (this.canAddInsufficientAmount) {
        this.setDialog('confirm');
      } else {
        this.setDialog('info');
      }
    } else {
      this.save();
    }
  }

  private getControl(controlName: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === controlName);
  }

  private save(promise: IPromise = null): void {
    const data: IPromise = promise || this.form.serializedUpdates;
    const action = this.promiseId
      ? this.promiseService.update(this.debtId, this.promiseId, data, this.callCenter)
      : this.promiseService.create(this.debtId, data, this.callCenter);

    action.subscribe(() => {
      this.promiseService.dispatchAction(PromiseService.MESSAGE_PROMISE_SAVED);
      this.setDialog();
      this.onBack();
    });
  }
}
