import { Component } from '@angular/core';

import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IEmployee } from '../../organizations.interface';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html'
})
export class EmployeeEditComponent extends EntityBaseComponent<IEmployee> {
  private canEdit = false;

  constructor(private gridService: GridService, private userPermissionsService: UserPermissionsService) {
    super();
    this.canEdit = this.userPermissionsService.hasPermission('ORGANIZATION_EDIT');
  }

  get formData(): IEmployee {
    return {
      ...this.editedEntity,
      fullName: `${this.editedEntity.lastName || ''} ${this.editedEntity.firstName || ''} ${this.editedEntity.middleName || ''}`
    };
  }

  protected getControls(): Array<IDynamicFormControl> {
    const roleSelectOptions = {
      options: [
        { value: 1, label: 'Сотрудник' },
        { value: 2, label: 'Руководитель' },
        { value: 3, label: 'Заместитель' },
        { value: 4, label: 'Куратор' },
      ]
    };

    return [
      { label: 'organizations.employees.edit.fullName', controlName: 'fullName', type: 'text' },
      { label: 'users.edit.position', controlName: 'position', type: 'text' },
      { label: 'users.edit.email', controlName: 'email', type: 'text' },
      { label: 'users.edit.mobPhone', controlName: 'mobPhone', type: 'text' },
      { label: 'users.edit.workPhone', controlName: 'workPhone', type: 'text' },
      { label: 'users.edit.intPhone', controlName: 'intPhone', type: 'text' },
      { label: 'users.edit.role', controlName: 'roleCode', type: 'select', required: true, disabled: !this.canEdit, ...roleSelectOptions },
      { label: 'users.edit.comment', controlName: 'comment', type: 'text', required: true, disabled: !this.canEdit }
    ].map((control: IDynamicFormControl) => ({
      ...control,
      disabled: control.hasOwnProperty('disabled') ? control.disabled : true
    }));
  }
}
