import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { IDynamicFormControl } from '../dynamic-form-2.interface';

import { DynamicFormGroupComponent } from '../../dynamic-form/group/dynamic-form-group.component';

@Component({
  selector: 'app-dynamic-form-2-control',
  templateUrl: './dynamic-form-2-control.component.html',
  styleUrls: [ './dynamic-form-2-control.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicForm2ControlComponent {
  static DEFAULT_MESSAGES = {};

  @Input() control: IDynamicFormControl;
  @Input() parentFormGroup: FormGroup;
  @Input() parentTranslationKey: string = null;

  get displayErrors(): boolean {
    return this._control && this.errors.length > 0 && (this._control.dirty || this._control.touched);
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

  private get _control(): AbstractControl {
    return this.parentFormGroup.get(this.control.name);
  }
}
