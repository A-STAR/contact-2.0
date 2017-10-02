import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormControl } from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IOption } from '../../../../../../core/converter/value-converter.interface';

import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { makeKey } from '../../../../../../core/utils';

const labelKey = makeKey('widgets.contactProperty.grid');

@Component({
  selector: 'app-contact-property-tree-edit',
  templateUrl: './contact-property-tree-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertyTreeEditComponent implements OnInit, OnDestroy {
  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  controls: IDynamicFormControl[];
  data = {};

  private _formSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this._formSubscription = this.userDictionariesService.getDictionariesAsOptions([
      UserDictionariesService.DICTIONARY_DEBT_STATUS,
      UserDictionariesService.DICTIONARY_DEBT_LIST_1,
      UserDictionariesService.DICTIONARY_DEBT_LIST_2,
      UserDictionariesService.DICTIONARY_DEBT_LIST_3,
      UserDictionariesService.DICTIONARY_DEBT_LIST_4,
      UserDictionariesService.DICTIONARY_CONTACT_INPUT_MODE,
      UserDictionariesService.DICTIONARY_CONTACT_PROMISE_INPUT_MODE,
    ]).subscribe(dictionaries => {
      this.controls = this.buildControls(dictionaries);
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    return true;
  }

  onSubmit(): void {
    this.submit.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private buildControls(dictionaries: { [key: number]: IOption[] }): IDynamicFormControl[] {
    const debtStatusOptions = dictionaries[UserDictionariesService.DICTIONARY_DEBT_STATUS].filter(option => option.value > 20000);
    const modeOptions = dictionaries[UserDictionariesService.DICTIONARY_CONTACT_INPUT_MODE];
    const promiseModeOptions = dictionaries[UserDictionariesService.DICTIONARY_CONTACT_PROMISE_INPUT_MODE];
    const dict1Options = dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_1];
    const dict2Options = dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_2];
    const dict3Options = dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_3];
    const dict4Options = dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_4];

    return [
      { label: labelKey('code'), controlName: 'code', type: 'text' },
      // TODO(d.maltsev): multi-text
      { label: labelKey('name'), controlName: 'name', type: 'text', required: true },
      // TODO(d.maltsev): color picker
      { label: labelKey('boxColor'), controlName: 'boxColor', type: 'text' },
      { label: labelKey('commentMode'), controlName: 'commentMode', type: 'select', options: modeOptions },
      // TODO(d.maltsev): options from lookup
      { label: labelKey('autoCommentIds'), controlName: 'autoCommentIds', type: 'select', options: [] },
      { label: labelKey('regInvisible'), controlName: 'regInvisible', type: 'select', options: modeOptions },
      { label: labelKey('nextCallMode'), controlName: 'nextCallMode', type: 'select', options: modeOptions },
      { label: labelKey('promiseMode'), controlName: 'promiseMode', type: 'select', options: promiseModeOptions },
      { label: labelKey('paymentMode'), controlName: 'paymentMode', type: 'select', options: promiseModeOptions },
      { label: labelKey('callReasonMode'), controlName: 'callReasonMode', type: 'select', options: modeOptions },
      { label: labelKey('debtStatusCode'), controlName: 'debtStatusCode', type: 'select', options: debtStatusOptions },
      { label: labelKey('statusReasonMode'), controlName: 'statusReasonMode', type: 'select', options: modeOptions },
      { label: labelKey('isInvalidContact'), controlName: 'isInvalidContact', type: 'checkbox' },
      { label: labelKey('addPhone'), controlName: 'addPhone', type: 'checkbox' },
      { label: labelKey('debtReasonMode'), controlName: 'debtReasonMode', type: 'select', options: modeOptions },
      { label: labelKey('isRefusal'), controlName: 'isRefusal', type: 'checkbox' },
      { label: labelKey('isSuccess'), controlName: 'isSuccess', type: 'checkbox' },
      { label: labelKey('changeResponsible'), controlName: 'changeResponsible', type: 'checkbox' },
      { label: labelKey('contactInvisible'), controlName: 'contactInvisible', type: 'checkbox' },
      { label: labelKey('regInvisible'), controlName: 'regInvisible', type: 'checkbox' },
      // TODO(d.maltsev): or templateFormula
      { label: labelKey('templateId'), controlName: 'templateId', type: 'text' },
      // TODO(d.maltsev): or nextCallFormula
      { label: labelKey('nextCallDays'), controlName: 'nextCallDays', type: 'text' },
      { label: labelKey('dictValue1'), controlName: 'dictValue1', type: 'select', options: dict1Options },
      { label: labelKey('dictValue2'), controlName: 'dictValue2', type: 'select', options: dict2Options },
      { label: labelKey('dictValue3'), controlName: 'dictValue3', type: 'select', options: dict3Options },
      { label: labelKey('dictValue4'), controlName: 'dictValue4', type: 'select', options: dict4Options },
      // TODO(d.maltsev): attributes tree on a separate tab
    ];
  }
}
