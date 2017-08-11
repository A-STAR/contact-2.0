import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IControls, IDynamicFormItem, IDynamicFormControl, ISelectItemsPayload, IValue } from './dynamic-form-control.interface';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit, OnChanges {

  @Input() controls: Array<IDynamicFormItem>;
  @Input() data: IValue;
  @Output() onSelect: EventEmitter<ISelectItemsPayload> = new EventEmitter<ISelectItemsPayload>();

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createForm();
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

  get value(): any {
    return this.getValue(control => !control.disabled);
  }

  get dirtyValue(): any {
    return this.getValue(control => control.dirty);
  }

  onSelectItems(event: ISelectItemsPayload): void {
    this.onSelect.emit(event);
  }

  private getValue(filter: (control: AbstractControl) => boolean): any {
    return Object.keys(this.form.value).reduce((acc, key) => {
      const control = this.form.get(key);
      if (filter(control)) {
        acc[key] = control.value === '' ? null : control.value;
      }
      return acc;
    }, {});
  }

  private createForm(): FormGroup {
    const controls = this.flattenFormControls(this.controls)
      .reduce((acc, control: IDynamicFormControl) => {
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
}
