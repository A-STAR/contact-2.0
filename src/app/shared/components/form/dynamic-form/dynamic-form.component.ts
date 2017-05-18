import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IControls, IDynamicFormControl, IValue } from './dynamic-form-control.interface';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {
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

  getControlErrors(control: IDynamicFormControl): Array<string> {
    const errors = this.form.controls[control.controlName].errors;
    return Object.keys(errors)
      .reduce((acc, key) => {
        if (errors[key] !== null) {
          const message = control.validationMessages && control.validationMessages[key] || key;
          acc.push(message);
        }
        return acc;
      }, [] as Array<string>);
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
