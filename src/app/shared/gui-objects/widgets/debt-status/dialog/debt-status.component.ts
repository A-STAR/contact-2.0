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
import { Subscription } from 'rxjs/Subscription';

import { ICloseAction, IGridActionParams } from '../../../../../shared/components/action-grid/action-grid.interface';
import { IDebtStatusDictionaries } from '../debt-status.interface';
import { IDynamicFormControl, IDynamicFormSelectControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IOperationResult } from '../../debt-responsible/debt-responsible.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { IUserConstant } from '@app/core/user/constants/user-constants.interface';

import { DebtResponsibleService } from '../../debt-responsible/debt-responsible.service';
import { DebtStatusService } from '../debt-status.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey, toLabeledValues } from '@app/core/utils';
import { combineLatest } from 'rxjs/observable/combineLatest';

const label = makeKey('massOperations.debtStatus');

@Component({
  selector: 'app-debt-status',
  templateUrl: './debt-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtStatusComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() actionData: IGridActionParams;

  @Output() close = new EventEmitter<ICloseAction>();

  dicts: IDebtStatusDictionaries = null;
  debtsCount: number | string;

  controls: Array<IDynamicFormControl> = null;
  formData: any;
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

    this.debtsCount = this.debtStatusService.getDebtsCount(this.actionData.payload);

    this.dictsSub = combineLatest(
      this.userDictionariesService.getDictionaries([
        UserDictionariesService.DICTIONARY_DEBT_STATUS,
        UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE,
      ]),
      this.userConstantsService.get('Debt.StatusReason.MandatoryList')
    )
    .subscribe(([dicts, constant]) => {

      this.dicts = { ...dicts, constant };

      const statusCodeOptions = this.dicts[UserDictionariesService.DICTIONARY_DEBT_STATUS].map(toLabeledValues);
      const reasonCodeOptions = this.dicts[UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE].map(toLabeledValues);

      this.controls = this.buildControls(statusCodeOptions, reasonCodeOptions);

      // Detecting changes, otherwise `this.form` will be undefined in `onCtrlValueChange`
      this.cdRef.detectChanges();

      this.statusCodeSub = this.form.onCtrlValueChange('statusCode')
        .distinctUntilChanged()
        .subscribe((statusCode: [{ value: number }]) => {
          // reset current reasonCode value
          this.form.form.patchValue({
            reasonCode: null
          });
          const reasonCodeControl = this.getControl('reasonCode') as IDynamicFormSelectControl;

          // filter reasonCode's options with respect to statusCode's value
          reasonCodeControl.options = this.dicts[UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE]
            .filter(term => term.parentCode === statusCode[0].value)
            .map(toLabeledValues);
          // disable when options list is empty
          reasonCodeControl.disabled = !reasonCodeControl.options.length;

          // set required flag
          reasonCodeControl.required = this.isReasonCodeRequired(this.dicts.constant, statusCode[0].value);

        });

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
  /**
   * Custom submission check.
   * We need to check that all required controls have value,
   * even if required control is disabled
   */
  get canSubmit(): boolean {
    return this.form && this.hasRequiredValues();
  }

  submit(): void {
    this.debtStatusService
      .change(this.actionData.payload, this.form.serializedUpdates)
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
        required: this.isReasonCodeRequired(this.dicts.constant),
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

  private isReasonCodeRequired(reasonCodeRequired: IUserConstant, code?: number): boolean {
    return reasonCodeRequired.valueS === 'ALL' || reasonCodeRequired.valueS.split(',').map(Number).includes(code);
  }
  /**
   * Checks whether all required controls have any value.
   * This is for special case when control can be disabled but still must be checked for the required value
   */
  private hasRequiredValues(): boolean {
    return this.form.getFlatControls()
      .filter(control => control.required)
      .every(c => !!this.form.serializedValue[c.controlName]);
  }
}
