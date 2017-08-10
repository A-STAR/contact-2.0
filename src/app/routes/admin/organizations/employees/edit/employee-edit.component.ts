import { Input, Component, OnInit } from '@angular/core';

import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IEmployeeUser } from '../../organizations.interface';

import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html'
})
export class EmployeeEditComponent extends EntityBaseComponent<IEmployeeUser> implements OnInit {
  @Input() employeeRoleOptions: Array<any> = [];

  formData: any;
  private canEdit = false;

  constructor(private userPermissionsService: UserPermissionsService) {
    super();
    // TODO(d.maltsev): unsubscribe
    this.userPermissionsService.has('ORGANIZATION_EDIT')
      .subscribe(permission => {
        this.canEdit = permission;
      });
  }

  ngOnInit(): void {
    this.formData = {
      ...this.editedEntity,
      roleCode: [ this.employeeRoleOptions.find(roleOption => roleOption.value === this.editedEntity.roleCode) ],
      fullName: `${this.editedEntity.lastName || ''} ${this.editedEntity.firstName || ''} ${this.editedEntity.middleName || ''}`
    };

    super.ngOnInit();
  }

  protected getControls(): Array<IDynamicFormItem> {
    return [
      {
        width: 8,
        children: [
          { label: 'organizations.employees.edit.fullName', controlName: 'fullName', type: 'text', disabled: true },
          { label: 'users.edit.position', controlName: 'position', type: 'text', disabled: true },
          { label: 'users.edit.role', controlName: 'roleCode', type: 'select', required: true, disabled: !this.canEdit,
              options: this.employeeRoleOptions },
          { label: 'organizations.employees.edit.isMain', controlName: 'isMain', type: 'checkbox', disabled: false },
        ]
      },
      {
        width: 4,
        children: [
          { label: 'users.edit.photo', controlName: 'image', type: 'image',
              url: this.editedEntity.userId ? `/users/${this.editedEntity.userId}/photo` : null, disabled: true, width: 12, height: 179 },
        ]
      },
      { label: 'users.edit.email', controlName: 'email', type: 'text', disabled: true },
      { label: 'users.edit.mobPhone', controlName: 'mobPhone', type: 'text', disabled: true },
      { label: 'users.edit.workPhone', controlName: 'workPhone', type: 'text', disabled: true },
      { label: 'users.edit.intPhone', controlName: 'intPhone', type: 'text', disabled: true },
      { label: 'users.edit.comment', controlName: 'comment', type: 'textarea', disabled: !this.canEdit },
    ] as Array<IDynamicFormItem>;
  }
}
