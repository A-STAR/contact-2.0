import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { first } from 'rxjs/operators/first';

import { IDebt } from '../../../../../../../core/debt/debt.interface';
import { IDynamicFormControl } from '../../../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IUserConstant } from '../../../../../../../core/user/constants/user-constants.interface';

import { DebtorCardService } from '../../../../../../../core/app-modules/debtor-card/debtor-card.service';
import { DebtService } from '../../../../../../../core/debt/debt.service';
import { UserConstantsService } from '../../../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debt-grid-status-dialog',
  templateUrl: './debt-grid-status-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtGridStatusDialogComponent implements AfterViewInit, OnDestroy {
  @Input() debt: IDebt;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl> = [
    { controlName: 'statusCode', type: 'radio', required: true, radioOptions: [] },
    { controlName: 'reasonCode', type: 'select', options: [] },
    { controlName: 'customStatusCode', type: 'select', options: [], disabled: true },
    { controlName: 'comment', type: 'textarea' }
  ].map(control => ({ ...control, label: `widgets.debt.dialogs.statusChange.${control.controlName}` }) as IDynamicFormControl);

  private formDataSubscription: Subscription;
  private statusCodeSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private debtService: DebtService,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngAfterViewInit(): void {
    this.formDataSubscription = combineLatest(
      this.userDictionariesService.getDictionaries([
        UserDictionariesService.DICTIONARY_DEBT_STATUS,
        UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE,
      ]),
      this.userPermissionsService.bag(),
      this.userConstantsService.get('Debt.StatusReason.MandatoryList'),
      this.form.onCtrlValueChange('statusCode').startWith(null),
      this.form.onCtrlValueChange('customStatusCode').startWith(null),
    )
    .pipe(
      distinctUntilChanged()
    )
    .subscribe(([ dictionaries, bag, reasonCodeRequired, statusCode, customStatusCode ]) => {
      this.getControl('statusCode').radioOptions = [
        {
          label: 'widgets.debt.dialogs.statusChange.statusProblematic',
          value: 9,
          disabled: !bag.contains('DEBT_STATUS_EDIT_LIST', 9),
        },
        {
          label: 'widgets.debt.dialogs.statusChange.statusInfoCollection',
          value: 15,
          disabled: !bag.contains('DEBT_STATUS_EDIT_LIST', 15),
        },
        {
          label: 'widgets.debt.dialogs.statusChange.statusFutile',
          value: 12,
          disabled: !bag.contains('DEBT_STATUS_EDIT_LIST', 12),
        },
        {
          label: 'widgets.debt.dialogs.statusChange.statusCustom',
          value: 0,
          disabled: !bag.containsCustom('DEBT_STATUS_EDIT_LIST') && !bag.containsALL('DEBT_STATUS_EDIT_LIST'),
        },
      ];

      const reasonCodeControl = this.getControl('reasonCode');
      const code = customStatusCode || statusCode;
      reasonCodeControl.required = this.isReasonCodeRequired(reasonCodeRequired, code);
      reasonCodeControl.options = dictionaries[UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE]
        .filter(option => option.parentCode === code)
        .map(term => ({ value: term.code, label: term.name }));

      const customStatusCodeControl = this.getControl('customStatusCode');
      customStatusCodeControl.disabled = statusCode !== 0;
      customStatusCodeControl.required = statusCode === 0;
      customStatusCodeControl.options = dictionaries[UserDictionariesService.DICTIONARY_DEBT_STATUS]
        .filter(term => term.code >= 20000)
        .map(term => ({ value: term.code, label: term.name }));

      this.cdRef.markForCheck();
    });

    this.statusCodeSubscription = this.form.onCtrlValueChange('statusCode')
      .distinctUntilChanged()
      .subscribe(() => {
        this.form.form.patchValue({
          reasonCode: null,
          customStatusCode: null
        });
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.formDataSubscription.unsubscribe();
    this.statusCodeSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    const { customStatusCode, statusCode, ...rest } = this.form.serializedUpdates;
    const value = {
      ...rest,
      statusCode: customStatusCode || statusCode,
    };
    this.debtorCardService.personId$
      .switchMap(personId => {
        return this.debtService.changeStatus(personId, this.debt.id, value, false);
      })
      .pipe(first())
      .subscribe(_ => {
        this.submit.emit();
        this.onClose();
      });
  }

  onClose(): void {
    this.close.emit();
  }

  private getControl(controlName: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === controlName);
  }

  private isReasonCodeRequired(reasonCodeRequired: IUserConstant, code: number): boolean {
    return reasonCodeRequired.valueS === 'ALL' || reasonCodeRequired.valueS.split(',').map(Number).includes(code);
  }
}
