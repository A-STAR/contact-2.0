import { Input, Component, OnInit } from '@angular/core';

import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';
import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IEmployeeUser } from '../../organizations.interface';

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

  protected getControls(): Array<IDynamicFormControl> {
    return ([
      { label: 'organizations.employees.edit.fullName', controlName: 'fullName', type: 'text' },
      { label: 'users.edit.position', controlName: 'position', type: 'text' },
      { label: 'users.edit.email', controlName: 'email', type: 'text' },
      { label: 'users.edit.mobPhone', controlName: 'mobPhone', type: 'text' },
      { label: 'users.edit.workPhone', controlName: 'workPhone', type: 'text' },
      { label: 'users.edit.intPhone', controlName: 'intPhone', type: 'text' },
      { label: 'users.edit.role', controlName: 'roleCode', type: 'select', required: true, disabled: !this.canEdit,
          options: this.employeeRoleOptions },
      { label: 'users.edit.comment', controlName: 'comment', type: 'text', disabled: !this.canEdit },
      { label: 'organizations.employees.edit.isMain', controlName: 'isMain', type: 'checkbox', disabled: false },
    ] as Array<IDynamicFormControl>).map((control: IDynamicFormControl) => ({
      ...control,
      disabled: control.hasOwnProperty('disabled') ? control.disabled : true
    }));
  }
}
