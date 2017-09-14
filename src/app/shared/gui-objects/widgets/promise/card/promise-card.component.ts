import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import * as moment from 'moment';

import { IDynamicFormControl } from '../../../../components/form/dynamic-form/dynamic-form.interface';
import { IPromise, IPromiseLimit } from '../promise.interface';
import { IDebt } from '../../debt/debt/debt.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { PromiseService } from '../promise.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

import { min } from '../../../../../core/validators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-promise-card',
  templateUrl: './promise-card.component.html'
})
export class PromiseCardComponent implements AfterViewInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private routeParams = (<any>this.route.params).value;
  private canAddInsufficientAmount: boolean;
  private debtId = this.routeParams.debtId;
  private debt: IDebt;
  private promiseId = this.routeParams.promiseId;
  private promiseLimit: IPromiseLimit;
  private minAmountPercentFormula: number;
  private minAmountPercentPermission: boolean;
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
      validators: [min(0)]
    },
    {
      label: 'widgets.promise.grid.receiveDateTime',
      controlName: 'receiveDateTime',
      type: 'datepicker',
      markAsDirty: true,
      required: true,
    },
    { label: 'widgets.promise.grid.comment', controlName: 'comment', type: 'textarea' },
  ];

  dialog: string;
  promise: IPromise;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private messageBusService: MessageBusService,
    private promiseService: PromiseService,
    private route: ActivatedRoute,
    private router: Router,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {

    this.canAddInsufficientAmountSub = this.canAddInsufficientAmount$
      .subscribe(canAdd => this.canAddInsufficientAmount = canAdd);
  }

  ngAfterViewInit(): void {
    Observable.combineLatest(
      this.userPermissionsService.has('PROMISE_ADD'),
      this.promiseService.getPromiseLimit(this.debtId),
      this.promiseService.fetchDebt(this.debtId),
      this.promiseId
        ? this.promiseService.fetch(this.debtId, this.promiseId)
        : Observable.of(null),
      this.userConstantsService.get('Promise.MinAmountPercent.Formula'),
      this.userPermissionsService.has('PROMISE_MIN_AMOUNT_PERCENT'),
    )
    .take(1)
    .subscribe(([
      canAdd, promiseLimit, debt, promise, minAmountPercentFormula, minAmountPercentPermission
    ]) => {
      this.minAmountPercentFormula = Number(minAmountPercentFormula.valueN);
      this.minAmountPercentPermission = minAmountPercentPermission;
      this.promiseLimit = promiseLimit;
      this.debt = <IDebt>debt;
      const { maxDays, minAmountPercent } = <IPromiseLimit>promiseLimit;
      // Calculate the minimum promise amount
      const minAmount = Math.round((minAmountPercent / 100) * debt.debtAmount * 100) / 100;
      const today = new Date();

      if (!promise) {
        const promiseDate = this.getControl('promiseDate');
        promiseDate.maxDate = maxDays == null ? null : moment(today).add(maxDays, 'day').toDate();
        const receiveDate = this.getControl('receiveDateTime');
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
        const promiseCtrl = this.getControl('promiseDate');

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
    const data = this.form.requestValue;
    data.isUnconfirmed = 1;
    this.save(data);
  }

  onBack(): void {
    this.contentTabService.gotoParent(this.router, 4);
  }

  onSubmit(): void {
    const data = this.form.requestValue;
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
    const data: IPromise = promise || this.form.requestValue;
    const action = this.promiseId
      ? this.promiseService.update(this.debtId, this.promiseId, data)
      : this.promiseService.create(this.debtId, data);

    action.subscribe(() => {
      this.messageBusService.dispatch(PromiseService.MESSAGE_PROMISE_SAVED);
      this.setDialog();
      this.onBack();
    });
  }
}
