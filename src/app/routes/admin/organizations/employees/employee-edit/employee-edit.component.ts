import { Component } from '@angular/core';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IEmployee } from '../../organizations.interface';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html'
})
export class EmployeeEditComponent extends EntityBaseComponent<IEmployee> {
  protected getControls(): Array<IDynamicFormControl> {
    return [
      { label: 'userId', controlName: 'userId', type: 'number', required: true },
      { label: 'roleCode', controlName: 'roleCode', type: 'number', required: true },
      { label: 'comment', controlName: 'comment', type: 'text', required: true }
    ];
  }
}
