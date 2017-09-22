import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { IAttribute } from '../../attribute.interface';
import { IDynamicFormControl } from '../../../../../components/form/dynamic-form/dynamic-form.interface';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../../core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-grid-edit',
  templateUrl: './attribute-grid-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridEditComponent {
  @Output() submit = new EventEmitter<Partial<IAttribute>>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    {
      label: labelKey('name'),
      controlName: 'name',
      type: 'text',
      required: true
    },
  ];
  attribute: IAttribute;

  get canSubmit(): boolean {
    return false;
  }

  onSubmit(): void {
    this.submit.emit(this.form.requestValue);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
