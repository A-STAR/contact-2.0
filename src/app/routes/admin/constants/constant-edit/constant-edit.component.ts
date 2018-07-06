import {
  Component, ChangeDetectorRef , ChangeDetectionStrategy, EventEmitter, Input, OnInit, Output, ViewChild
} from '@angular/core';

import { IConstant } from '../constants.interface';
import { IDynamicFormItem, IDynamicFormConfig } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ValueConverterService } from '../../../../core/converter/value-converter.service';
import { UserDictionariesService } from 'app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { getFormControlConfig } from '@app/core/utils';

@Component({
  selector: 'app-constant-edit',
  templateUrl: './constant-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstantEditComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() constant: IConstant;

  @Output() submit = new EventEmitter<IConstant>();
  @Output() cancel = new EventEmitter<void>();

  config: IDynamicFormConfig = {
    labelKey: 'constants.edit',
  };
  controls: Array<IDynamicFormItem>;
  data: IConstant;

  constructor(
    private cdRef: ChangeDetectorRef,
    private valueConverterService: ValueConverterService,
  ) {}

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  ngOnInit(): void {
    this.controls = this.getControls(this.constant);
    this.data = {
      ...this.constant,
      value: this.constant.typeCode === 2
        ? this.valueConverterService.fromISO(this.constant.valueD)
        : this.constant.value
    };
    this.cdRef.markForCheck();
  }

  onSubmit(): void {
    // Grab the typeCode by hand, 'cause it's not dirty
    const typeCode = this.form.getControl('typeCode').value;
    const data = { ...this.form.serializedUpdates, typeCode };
    this.submit.emit(data);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private getControls(data: IConstant): IDynamicFormItem[] {
    const type = getFormControlConfig(data);

    return [
      { controlName: 'name', type: 'text', disabled: true },
      {
        controlName: 'typeCode',
        type: 'select',
        disabled: true,
        dictCode: UserDictionariesService.DICTIONARY_VARIABLE_TYPE
      },
      { controlName: 'value', ...type },
      { controlName: 'dsc', type: 'textarea', disabled: true },
    ] as IDynamicFormItem[];
  }
}
