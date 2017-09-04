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
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
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

  controls: IDynamicFormControl[] = null;
  dialog: string;
  promise: IPromise;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private lookupService: LookupService,
    private messageBusService: MessageBusService,
    private promiseService: PromiseService,
    private route: ActivatedRoute,
    private router: Router,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {

    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PROMISE_STATUS),
      this.lookupService.lookupAsOptions('currencies'),
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
      options, currencyOptions, canAdd, promiseLimit,
      debt, promise, minAmountPercentFormula, minAmountPercentPermission
    ]) => {
      this.minAmountPercentFormula = Number(minAmountPercentFormula.valueN);
      this.minAmountPercentPermission = minAmountPercentPermission;
      this.promiseLimit = promiseLimit;
      this.debt = <IDebt>debt;
      const { maxDays, minAmountPercent } = <IPromiseLimit>promiseLimit;
      const today = new Date();
      // Calculate the minimum promise amount
      const minAmount = Math.round((minAmountPercent / 100) * debt.debtSum * 100) / 100;
      this.promise = promise ? promise : { receiveDateTime: today, promiseAmount: minAmount };
      const controls: IDynamicFormControl[] = [
        { label: 'widgets.promise.grid.promiseDate', controlName: 'promiseDate', type: 'datepicker', required: true },
        {
          label: 'widgets.promise.grid.promiseAmount',
          controlName: 'promiseAmount',
          type: 'number',
          required: true,
          markAsDirty: !promise,
          validators: [min(0)]
        },
        {
          label: 'widgets.promise.grid.receiveDateTime',
          controlName: 'receiveDateTime',
          type: 'datepicker',
          required: true,
          markAsDirty: !promise,
        },
        { label: 'widgets.promise.grid.comment', controlName: 'comment', type: 'textarea' },
      ];
      if (!promise) {
        controls[0].minDate = moment(today).add(0, 'day').toDate();
        controls[0].maxDate = maxDays == null ? null : moment(today).add(maxDays, 'day').toDate();
      }
      this.controls = promise
        ? controls.map(control => ({ ...control, disabled: true }))
        : controls.map(control => canAdd ? control : { ...control, disabled: true });
      this.cdRef.markForCheck();
    });

    this.canAddInsufficientAmountSub = this.canAddInsufficientAmount$
      .subscribe(canAdd => this.canAddInsufficientAmount = canAdd);
  }

  ngAfterViewInit(): void {
    if (!this.form) {
      setTimeout(() => {
        // console.log('form is not ready', this.form);
      }, 1000);
    } else {
      console.log('form should be ready');
    }
  }

  ngOnDestroy(): void {
    this.canAddInsufficientAmountSub.unsubscribe();
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
    data.promiseDate = moment(this.form.value.promiseDate).utcOffset(0, true).format('YYYY-MM-DD');
    data.isUnconfirmed = 1;
    this.save(data);
  }

  onBack(): void {
    this.contentTabService.gotoParent(this.router, 4);
  }

  onSubmit(): void {
    const data = this.form.requestValue;
    if (data.promiseAmount < this.debt.debtSum * this.minAmountPercent / 100) {
      if (this.canAddInsufficientAmount) {
        this.setDialog('confirm');
      } else {
        this.setDialog('info');
      }
    } else {
      this.save();
    }
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
