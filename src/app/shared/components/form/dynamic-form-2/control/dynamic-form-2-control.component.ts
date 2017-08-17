import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDynamicFormControl } from '../dynamic-form-2.interface';

import { DynamicFormGroupComponent } from '../../dynamic-form/group/dynamic-form-group.component';

@Component({
  selector: 'app-dynamic-form-2-control',
  templateUrl: './dynamic-form-2-control.component.html',
  styleUrls: [ './dynamic-form-2-control.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicForm2ControlComponent implements OnInit {
  static DEFAULT_MESSAGES = {};

  @Input() control: IDynamicFormControl;
  @Input() parentFormGroup: FormGroup;
  @Input() parentTranslationKey: string = null;

  private _control;

  ngOnInit(): void {
    this._control = this.parentFormGroup.get(this.control.name);
  }

  get displayErrors(): boolean {
    return this.errors.length > 0 && (this._control.dirty || this._control.touched);
  }

  get errors(): Array<any> {
    return Object.keys(this._control.errors || {});
  }

  get label(): string {
    const label = this.control.label || this.control.name;
    return this.parentTranslationKey ? `${this.parentTranslationKey}.${label}` : label;
  }

  getErrorTranslationKey(key: string): string {
    return DynamicFormGroupComponent.DEFAULT_MESSAGES[key];
  }

  getErrorParams(key: string): object {
    return this._control.errors[key];
  }
}
