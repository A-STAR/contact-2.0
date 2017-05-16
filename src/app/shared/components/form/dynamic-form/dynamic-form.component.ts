import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IControls, IDynamicFormControl } from './dynamic-form-control.interface';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {
  @Input() controls: Array<IDynamicFormControl>;

  private form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createForm();
  }

  get canSubmit(): boolean {
    return this.form.dirty && this.form.valid;
  }

  get value(): any {
    return this.form.value;
  }

  private createForm(): FormGroup {
    const controls = this.controls
      .reduce((acc, control) => {
        const options = {
          disabled: control.disabled,
          value: control.value
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
}
