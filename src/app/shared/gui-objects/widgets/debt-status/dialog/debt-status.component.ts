import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ICloseAction } from '../../../../../shared/components/action-grid/action-grid.interface';
import { IDebtStatusDictionaries } from '../debt-status.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IOperationResult } from '../../debt-responsible/debt-responsible.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';
import { IUserConstant } from '../../../../../core/user/constants/user-constants.interface';

import { DebtResponsibleService } from '../../debt-responsible/debt-responsible.service';
import { DebtStatusService } from '../debt-status.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey, toLabeledValues } from '../../../../../core/utils';

const label = makeKey('massOperations.debtStatus');

@Component({
  selector: 'app-debt-status',
  templateUrl: './debt-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtStatusComponent implements OnInit, OnDestroy {

  @Input() debts: number[];

  @Output() close = new EventEmitter<ICloseAction>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  count: number;
  dicts: IDebtStatusDictionaries = null;

  controls: Array<IDynamicFormControl> = null;
  private statusCodeSub: Subscription;
  private dictsSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtStatusService: DebtStatusService,
    private debtResponsibleService: DebtResponsibleService,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService
  ) { }

  ngOnInit(): void {
    this.count = this.debts.length;

    this.dictsSub = Observable.combineLatest(
      this.userDictionariesService.getDictionaries([
        UserDictionariesService.DICTIONARY_DEBT_STATUS,
        UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE,
      ]),
      this.userConstantsService.get('Debt.StatusReason.MandatoryList')
    ).subscribe(([dicts, constant]) => {

      this.dicts = { ...dicts, constant };

      const statusCodeOptions = this.dicts[UserDictionariesService.DICTIONARY_DEBT_STATUS].map(toLabeledValues);
      const reasonCodeOptions = this.dicts[UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE].map(toLabeledValues);

      this.controls = this.buildControls(statusCodeOptions, reasonCodeOptions);

      this.statusCodeSub = this.form.onCtrlValueChange('statusCode')
        .distinctUntilChanged()
        .subscribe((statusCode) => {
          // reset current reasonCode value
          this.form.form.patchValue({
            reasonCode: null
          });
          const reasonCodeControl = this.getControl('reasonCode');

          // filter reasonCode's options with respect to statusCode's value
          reasonCodeControl.options = this.dicts[UserDictionariesService.DICTIONARY_DEBT_STATUS]
            .filter(term => term.parentCode === statusCode)
            .map(toLabeledValues);

          // set required flag
          reasonCodeControl.required = this.isReasonCodeRequired(this.dicts.constant, statusCode);

          this.cdRef.markForCheck();
        });

      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.dictsSub) {
      this.dictsSub.unsubscribe();
    }
    if (this.statusCodeSub) {
      this.statusCodeSub.unsubscribe();
    }
  }

  get canSubmit(): boolean {
    return !(this.form && this.form.canSubmit);
  }

  submit(): void {
    this.debtStatusService
      .change(this.debts, this.form.serializedUpdates)
      .subscribe(result => this.onOperationResult(result));
  }

  cancel(): void {
    this.close.emit();
  }

  onOperationResult(result: IOperationResult): void {
    this.debtResponsibleService.showOperationNotification(result);
    this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
  }

  private buildControls(statusOptions: IOption[], reasonOptions: IOption[]): IDynamicFormControl[] {
    return [
      {
        label: label('dialog.statusCode'),
        controlName: 'statusCode',
        type: 'select',
        required: true,
        options: statusOptions
      },
      {
        label: label('dialog.reasonCode'),
        controlName: 'reasonCode',
        type: 'select',
        options: reasonOptions
      },
      {
        label: label('dialog.comment'),
        controlName: 'comment',
        type: 'textarea'
      },
    ];
  }

  private getControl(controlName: string): IDynamicFormControl {
    return this.controls.find(control => (control as IDynamicFormControl).controlName === controlName);
  }

  private isReasonCodeRequired(reasonCodeRequired: IUserConstant, code: number): boolean {
    return reasonCodeRequired.valueS === 'ALL' || reasonCodeRequired.valueS.split(',').map(Number).includes(code);
  }

}
