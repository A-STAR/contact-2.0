import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IControls, IDynamicFormControl, IValue } from './dynamic-form-control.interface';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  static DEFAULT_MESSAGES = {
    minlength: 'validation.FIELD_MIN_LENGTH',
    hasdigits: 'validation.FIELD_DIGITS',
    haslowercasechars: 'validation.FIELD_LOWER_CASE',
    hasuppercasechars: 'validation.FIELD_UPPER_CASE',
  };

  @Input() controls: Array<IDynamicFormControl>;
  @Input() data: IValue;

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createForm();
    this.populateForm();
  }

  debug(a: any): string {
    return JSON.stringify(a);
  }

  get canSubmit(): boolean {
    return this.form.dirty && this.form.valid;
  }

  get value(): any {
    return this.form.getRawValue();
  }

  displayControlErrors(control: IDynamicFormControl): boolean {
    const formControl = this.form.controls[control.controlName];

    // TODO: double check this
    return formControl.errors && (formControl.dirty || formControl.touched);
  }

  getControlErrors(control: IDynamicFormControl): Array<any> {
    const errors = this.form.controls[control.controlName].errors;
    return Object.keys(errors).map(key => ({
      message: control.validationMessages && control.validationMessages[key] || DynamicFormComponent.DEFAULT_MESSAGES[key] || key,
      data: errors[key]
    }));
  }

  private createForm(): FormGroup {
    const controls = this.controls
      .reduce((acc, control: IDynamicFormControl) => {
        const options = {
          disabled: control.disabled,
          value: ''
        };
        const validators = Validators.compose([
          ...control.validators || [],
          control.required ? Validators.required : undefined
        ]);
        acc[control.controlName] = new FormControl(options, validators);
        return acc;
      }, {} as IControls);

    return this.formBuilder.group(controls);
  }

  private populateForm(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }
}
