import { Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IPermissionRole } from '../../roles-and-permissions.interface';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html'
})
export class RolesEditComponent extends EntityBaseComponent<IPermissionRole> {
  get title(): string {
    return this.editedEntity ? 'roles.roles.edit.title' : 'roles.roles.create.title';
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'roles.roles.edit.name',
        controlName: 'name',
        type: 'text',
        required: true
      },
      {
        label: 'roles.roles.edit.comment',
        controlName: 'comment',
        type: 'textarea',
        rows: 2
      }
    ];
  }

  get formData(): any {
    return this.editedEntity;
  }
}
