import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IControls, IDynamicFormGroup, IDynamicFormItem, IDynamicFormControl, ISelectedControlItemsPayload, IValue } from './dynamic-form-control.interface';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
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
    const controls = this.controls
      // TODO: recursion
      // TODO: item type
      .reduce((acc, item: any) => {
        const addControls = item.children || [ item ];
        return [
          ...acc,
          ...addControls
        ];
      }, [] as Array<IDynamicFormControl>)
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
