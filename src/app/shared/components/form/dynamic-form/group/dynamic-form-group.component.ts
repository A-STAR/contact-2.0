import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDynamicFormItem, IDynamicFormControl, ISelectItemsPayload } from '../dynamic-form.interface';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: [ './dynamic-form-group.component.scss' ],
  animations: [
    trigger(
      'isCollapsed', [
        transition(':enter', [
          style({ height: '0', overflow: 'hidden' }),
          animate('150ms ease', style({ height: '*' }))
        ]),
        transition(':leave', [
          style({ height: '*', overflow: 'hidden' }),
          animate('150ms ease', style({ height: '0' }))
        ]),
      ]
    )
  ]
})
export class DynamicFormGroupComponent {
  static DEFAULT_MESSAGES = {
    required: 'validation.fieldRequired',
    min: 'validation.fieldMin',
    max: 'validation.fieldMax',
    minDateTime: 'validation.fieldMinDateTime',
    minlength: 'validation.fieldMinLength',
    hasdigits: 'validation.fieldDigits',
    haslowercasechars: 'validation.fieldLowerCase',
    hasuppercasechars: 'validation.fieldUpperCase',
    invalid: 'validation.invalid',
    multilanguageRequired: 'validation.multilanguageRequired',
    maxsize: 'validation.fieldMaxSize',
    oneofgrouprequired: 'validation.oneOfGroupRequired',
    datepicker: 'validation.datepicker',
    timepicker: 'validation.timepicker',
  };

  @Input() collapsible = false;
  @Input() form: FormGroup;
  @Input() items = [] as Array<IDynamicFormItem>;
  @Input() title = null;
  @Input() width: number;

  @Output() onSelect: EventEmitter<ISelectItemsPayload> = new EventEmitter<ISelectItemsPayload>();

  _isCollapsed = false;

  get isCollapsed(): boolean {
    return this._isCollapsed;
  }

  toggle(): void {
    if (this.collapsible) {
      this._isCollapsed = !this._isCollapsed;
    }
  }

  displayControlErrors(control: IDynamicFormControl): boolean {
    const formControl = this.form.controls[control.controlName];
    return formControl && formControl.errors && (formControl.dirty || formControl.touched);
  }

  getControlErrors(control: IDynamicFormControl): Array<any> {
    const errors = this.form.controls[control.controlName].errors;
    return Object.keys(errors)
      .map(key => ({
        message: control.validationMessages
          && control.validationMessages[key] || DynamicFormGroupComponent.DEFAULT_MESSAGES[key] || key,
        data: errors[key]
      }))
      .slice(0, 1);
  }

  onSelectItems(event: ISelectItemsPayload): void {
    this.onSelect.emit(event);
  }

  trackByFn(index: number): number {
    return index;
  }
}
