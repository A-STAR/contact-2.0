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

  private flatControls: Array<IDynamicFormControl>;

  constructor(
    private formBuilder: FormBuilder,
    private valueConverterService: ValueConverterService,
  ) {}

  ngOnInit(): void {
    this.flatControls = this.flattenFormControls(this.controls);
    this.form = this.createForm(this.flatControls);
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
   * Loop through all the form controls and convert their values to an object
   *
   * @readonly
   * @type {*}
   * @memberof DynamicFormComponent
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

  /**
   * Loop through dirty form controls and convert values to an object
   *
   * @readonly
   * @type {*}
   * @memberof DynamicFormComponent
   */
  get requestValue(): any {
    return Object.keys(this.form.value).reduce((acc, key) => {
      const control = this.form.get(key);
      if (control.dirty) {
        acc[key] = this.toRequest(control.value, this.flatControls.find(c => c.controlName === key));
      }
      return acc;
    }, {});
  }

  onSelectItems(event: ISelectItemsPayload): void {
    this.onSelect.emit(event);
  }

  private createForm(flatControls: Array<IDynamicFormControl>): FormGroup {
    const controls = flatControls.reduce((acc, control: IDynamicFormControl) => {
      const options = {
        disabled: control.disabled,
        value: control.type === 'checkbox' ? false : '',
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
    return formControls.reduce((acc, control: IDynamicFormItem) => {
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
        return ['nameTranslations', 'translatedName'].includes(control.controlName)
        ? value
        : Array.isArray(value) && !control.multiple ? value[0].value : value.map(item => item.value);
      case 'datepicker':
        return value = '' ? null : this.valueConverterService.toISO(value);
      case 'boolean':
      case 'checkbox':
        return Number(value);
      default:
        return value === '' ? null : value;
    }
  }
}
