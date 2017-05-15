import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { IDynamicFormControl } from './dynamic-form-control.interface';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {
  @Input() controls: Array<IDynamicFormControl>;

  @Output() canSubmit: EventEmitter<boolean> = new EventEmitter();
  @Output() formValue: EventEmitter<any> = new EventEmitter();

  private form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createForm();
    this.form.valueChanges.subscribe(() => {
      this.formValue.emit(this.form.getRawValue());
      this.canSubmit.emit(this.form.valid && this.form.dirty);
    });
  }

  private createForm(): FormGroup {
    const controls = this.controls
      .reduce((acc, control) => {
        const options = {
          disabled: control.disabled,
          value: control.value
        };
        const validators = control.required ? Validators.required : undefined;
        acc[control.controlName] = new FormControl(options, validators);
        return acc;
      }, {});

    return this.formBuilder.group(controls);
  }
}
