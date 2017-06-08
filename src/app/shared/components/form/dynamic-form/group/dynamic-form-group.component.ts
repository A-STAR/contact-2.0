import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDynamicFormItem, IDynamicFormControl, ISelectedControlItemsPayload } from '../dynamic-form-control.interface';
import { ILabeledValue } from '../../../../../core/converter/value/value-converter.interface';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html'
})
export class DynamicFormGroupComponent {
  static DEFAULT_MESSAGES = {
    required: 'validation.fieldRequired',
    minlength: 'validation.fieldMinLength',
    hasdigits: 'validation.fieldDigits',
    haslowercasechars: 'validation.fieldLowerCase',
    hasuppercasechars: 'validation.fieldUpperCase',
  };

  @Input() form: FormGroup;
  @Input() items = [] as Array<IDynamicFormItem>;
  @Output() selectedControlItemsChanges: EventEmitter<ISelectedControlItemsPayload> = new EventEmitter<ISelectedControlItemsPayload>();

  displayControlErrors(control: IDynamicFormControl): boolean {
    const formControl = this.form.controls[control.controlName];

    // TODO: double check this
    // return formControl.errors && (formControl.dirty || formControl.touched);
    return false;
  }

  getControlErrors(control: IDynamicFormControl): Array<any> {
    // const errors = this.form.controls[control.controlName].errors;
    // return Object.keys(errors).map(key => ({
    //   message: control.validationMessages && control.validationMessages[key] || DynamicFormGroupComponent.DEFAULT_MESSAGES[key] || key,
    //   data: errors[key]
    // }));
    return [];
  }

  // TODO: duplication
  onSelectedControlItemsChanges(control: IDynamicFormControl, items: ILabeledValue[]): void {
    this.selectedControlItemsChanges.emit({ control, items });
  }

  // TODO: duplication
  onSelectedControlItemsChanges2(event: ISelectedControlItemsPayload): void {
    this.selectedControlItemsChanges.emit(event);
  }
}
