import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { IControls, IDynamicFormItem, IDynamicFormControl, ISelectItemsPayload, IValue } from './dynamic-form-control.interface';

import { ValueConverterService } from '../../../../core/converter/value-converter.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit, OnChanges {

  @Input() controls: Array<IDynamicFormItem>;
  @Input() data: IValue;
  @Output() onSelect: EventEmitter<ISelectItemsPayload> = new EventEmitter<ISelectItemsPayload>();

  form: FormGroup;

  private flattenedControls: Array<IDynamicFormControl>;

  constructor(
    private formBuilder: FormBuilder,
    private valueConverterService: ValueConverterService,
  ) {}

  ngOnInit(): void {
    this.flattenedControls = this.flattenFormControls(this.controls);
    this.form = this.createForm(this.flattenedControls);
    this.populateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes && this.form) {
      this.populateForm();
    }
  }

  get canSubmit(): boolean {
    return this.form.dirty && this.form.valid;
  }

  /**
   * @deprecated
   */
  get value(): any {
    return Object.keys(this.form.value).reduce((acc, key) => {
      const control = this.form.get(key);
      if (!control.disabled) {
        acc[key] = control.value === '' ? null : control.value;
      }
      return acc;
    }, {});
  }

  /**
   * @deprecated
   */
  get dirtyValue(): any {
    return Object.keys(this.form.value).reduce((acc, key) => {
      const control = this.form.get(key);
      if (control.dirty) {
        acc[key] = control.value === '' ? null : control.value;
      }
      return acc;
    }, {});
  }

  get requestValue(): any {
    return Object.keys(this.form.value).reduce((acc, key) => {
      const control = this.form.get(key);
      if (control.dirty) {
        acc[key] = control.value === '' ? null : this.toRequest(control.value, this.flattenedControls.find(c => c.controlName === key));
      }
      return acc;
    }, {});
  }

  onSelectItems(event: ISelectItemsPayload): void {
    this.onSelect.emit(event);
  }

  private createForm(flattenedControls: Array<IDynamicFormControl>): FormGroup {
    const controls = flattenedControls.reduce((acc, control: IDynamicFormControl) => {
      const options = {
        disabled: control.disabled,
        value: ''
      };
      const validators = control.required
        ? Validators.compose([ ...control.validators || [], Validators.required ])
        : control.validators;
      acc[control.controlName] = new FormControl(options, validators);
      return acc;
    }, {} as IControls);
    return this.formBuilder.group(controls);
  }

  private flattenFormControls(formControls: Array<IDynamicFormItem>): Array<IDynamicFormControl> {
    // TODO: item type
    return formControls.reduce((acc, control: any) => {
      const controls = control.children ? this.flattenFormControls(control.children) : [ control ];
      return [
        ...acc,
        ...controls
      ];
    }, []);
  }

  private populateForm(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  private toRequest(value: any, control: IDynamicFormControl): any {
    switch (control.type) {
      case 'select':
        return Array.isArray(value) && !control.multiple ? value[0].value : value.map(item => item.value);
      case 'datepicker':
        return this.valueConverterService.toISO(value);
      case 'boolean':
      case 'checkbox':
        return Number(value);
      default:
        return value;
    }
  }
}
