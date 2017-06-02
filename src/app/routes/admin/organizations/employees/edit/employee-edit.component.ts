import { Component } from '@angular/core';

import { PermissionsService } from '../../../../../core/permissions/permissions.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IEmployeeUser } from '../../organizations.interface';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html'
})
export class EmployeeEditComponent extends EntityBaseComponent<IEmployeeUser> {
  private canEdit = false;

  // TODO: dictionary service
  private options = [
    { value: 1, label: 'Сотрудник' },
    { value: 2, label: 'Руководитель' },
    { value: 3, label: 'Заместитель' },
    { value: 4, label: 'Куратор' },
  ];

  constructor(private gridService: GridService, private permissionsService: PermissionsService) {
    super();
    this.canEdit = this.permissionsService.hasPermission('ORGANIZATION_EDIT');
  }

  get formData(): any {
    return {
      ...this.editedEntity,
      roleCode: [ this.options.find(roleOption => roleOption.value === this.editedEntity.roleCode) ],
      fullName: `${this.editedEntity.lastName || ''} ${this.editedEntity.firstName || ''} ${this.editedEntity.middleName || ''}`
    };
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      { label: 'organizations.employees.edit.fullName', controlName: 'fullName', type: 'text' },
      { label: 'users.edit.position', controlName: 'position', type: 'text' },
      { label: 'users.edit.email', controlName: 'email', type: 'text' },
      { label: 'users.edit.mobPhone', controlName: 'mobPhone', type: 'text' },
      { label: 'users.edit.workPhone', controlName: 'workPhone', type: 'text' },
      { label: 'users.edit.intPhone', controlName: 'intPhone', type: 'text' },
      { label: 'users.edit.role', controlName: 'roleCode', type: 'select', required: true, disabled: !this.canEdit, options: this.options },
      { label: 'users.edit.comment', controlName: 'comment', type: 'text', disabled: !this.canEdit }
    ].map((control: IDynamicFormControl) => ({
      ...control,
      disabled: control.hasOwnProperty('disabled') ? control.disabled : true
    }));
  }
}
