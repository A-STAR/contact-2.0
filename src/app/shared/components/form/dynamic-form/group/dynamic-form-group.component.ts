import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDynamicFormItem, IDynamicFormControl, ISelectedControlItemsPayload } from '../dynamic-form-control.interface';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: [ './dynamic-form-group.component.scss' ]
})
export class DynamicFormGroupComponent {
  static DEFAULT_MESSAGES = {
    required: 'validation.fieldRequired',
    minlength: 'validation.fieldMinLength',
    hasdigits: 'validation.fieldDigits',
    haslowercasechars: 'validation.fieldLowerCase',
    hasuppercasechars: 'validation.fieldUpperCase',
  };

  @Input() collapsible = false;
  @Input() form: FormGroup;
  @Input() items = [] as Array<IDynamicFormItem>;
  @Input() title = null;
  @Input() width: number;

  @Output() selectedControlItemsChanges: EventEmitter<ISelectedControlItemsPayload> = new EventEmitter<ISelectedControlItemsPayload>();

  _isCollapsed = false;

  get isCollapsed(): boolean {
    return this._isCollapsed;
  }

  toggle(): void {
    this._isCollapsed = !this._isCollapsed;
  }

  displayControlErrors(control: IDynamicFormControl): boolean {
    const formControl = this.form.controls[control.controlName];
    return formControl.errors && (formControl.dirty || formControl.touched);
  }

  getControlErrors(control: IDynamicFormControl): Array<any> {
    const errors = this.form.controls[control.controlName].errors;
    return Object.keys(errors).map(key => ({
      message: control.validationMessages && control.validationMessages[key] || DynamicFormGroupComponent.DEFAULT_MESSAGES[key] || key,
      data: errors[key]
    }));
  }

  onSelectedControlItemsChanges(event: ISelectedControlItemsPayload): void {
    this.selectedControlItemsChanges.emit(event);
  }
}
