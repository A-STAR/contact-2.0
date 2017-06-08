import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IControls, IDynamicFormItem, IDynamicFormControl, ISelectedControlItemsPayload, IValue } from './dynamic-form-control.interface';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {

  @Output() selectedControlItemsChanges: EventEmitter<ISelectedControlItemsPayload> = new EventEmitter<ISelectedControlItemsPayload>();
  @Input() controls: Array<IDynamicFormItem>;
  @Input() data: IValue;

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createForm();
    this.populateForm();

    this.form.statusChanges.subscribe(() => this.onControlsStatusChanges());
  }

  get canSubmit(): boolean {
    return this.form.dirty && this.form.valid;
  }

  get value(): any {
    return this.form.getRawValue();
  }

  onControlsStatusChanges(): void {
  }

  onSelectedControlItemsChanges(event: ISelectedControlItemsPayload): void {
    this.selectedControlItemsChanges.emit(event);
  }

  private createForm(): FormGroup {
    const controls = this.flattenFormControls(this.controls)
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

  private flattenFormControls(formControls: Array<IDynamicFormItem>): Array<IDynamicFormControl> {
    // TODO: item type
    return formControls.reduce((acc, control: any) => {
      const controls = control.children ? this.flattenFormControls(control.children) : [ control ];
      return [
        ...acc,
        ...controls
      ];
    }, [] as Array<IDynamicFormControl>);
  }

  private populateForm(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }
}
