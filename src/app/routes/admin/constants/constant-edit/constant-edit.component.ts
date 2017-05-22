import { Component } from '@angular/core';

import { EntityBaseComponent } from '../../../../shared/components/entity/edit/entity.base.component';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IConstant } from '../constants.interface';

@Component({
  selector: 'app-constant-edit',
  templateUrl: './constant-edit.component.html'
})
export class ConstantEditComponent extends EntityBaseComponent<IConstant> {
  protected getControls(): Array<IDynamicFormControl> {
    const options = [
      { label: 'Число', value: 1 },
      { label: 'Дата', value: 2 },
      { label: 'Строка', value: 3 },
      { label: 'Булево', value: 4 },
      { label: 'Деньги', value: 5 },
      { label: 'Словарь', value: 6 },
    ];

    return [
      { label: 'id', controlName: 'id', type: 'hidden', required: true, disabled: true },
      { label: 'constants.edit.name', controlName: 'name', type: 'text', required: true, disabled: true },
      { label: 'constants.edit.type', controlName: 'typeCode', type: 'select', required: true, disabled: true, options },
      { label: 'constants.edit.value', controlName: 'value', type: 'dynamic', dependsOn: 'typeCode', required: true },
      { label: 'constants.edit.comment', controlName: 'dsc', type: 'textarea', required: true, disabled: true },
    ];
  }
}
