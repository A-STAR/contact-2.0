import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDynamicFormGroup, IDynamicFormItem } from '../dynamic-form-2.interface';

import { DynamicFormGroupComponent } from '../../dynamic-form/group/dynamic-form-group.component';

@Component({
  selector: 'app-dynamic-form-2-group',
  templateUrl: './dynamic-form-2-group.component.html',
  styleUrls: [ './dynamic-form-2-group.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicForm2GroupComponent {
  @Input() group: IDynamicFormGroup;
  @Input() formGroup: FormGroup;

  get displayErrors(): boolean {
    return this.errors.length > 0 && (this.formGroup.dirty || this.formGroup.touched);
  }

  get errors(): Array<any> {
    return Object.keys(this.formGroup.errors || {});
  }

  getErrorTranslationKey(key: string): string {
    return DynamicFormGroupComponent.DEFAULT_MESSAGES[key];
  }

  getErrorParams(key: string): object {
    return this.formGroup.errors[key];
  }

  getItemClass(item: IDynamicFormItem): string {
    return `col-xs-${item.width || 12}`;
  }

  trackByFn(index: number): number {
    return index;
  }
}
