import { Input, Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';
import { IEmployeeViewEntity } from '../../organizations.interface';
import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html'
})
export class EmployeeEditComponent implements OnInit {
  @Input() employeeRoleOptions: Array<any> = [];
  @Input() editedEntity: IEmployeeViewEntity;
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  formData: any;
  controls: Array<IDynamicFormItem>;
  private canEdit = false;

  constructor(private userPermissionsService: UserPermissionsService) {

  }

  ngOnInit(): void {

    this.formData = {
      ...this.editedEntity,
      roleCode: [ this.employeeRoleOptions.find(roleOption => roleOption.value === this.editedEntity.roleCode) ],
    };

    this.userPermissionsService.has('ORGANIZATION_EDIT')
      .take(1)
      .subscribe(permission => {
        this.setControls(this.canEdit = permission);
      });

    }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    this.submit.emit(this.form.serializedUpdates);
  }

  private setControls(canEdit: boolean): void {
    this.controls = [
      {
        width: 8,
        children: [
          { label: 'organizations.employees.edit.fullName', controlName: 'fullName', type: 'text', disabled: true },
          { label: 'users.edit.position', controlName: 'position', type: 'text', disabled: true },
          {
            label: 'users.edit.role', controlName: 'roleCode', type: 'select', required: true, disabled: !canEdit,
            options: this.employeeRoleOptions
          },
          { label: 'organizations.employees.edit.isMain', controlName: 'isMain', type: 'checkbox', disabled: false },
        ]
      },
      {
        width: 4,
        children: [
          {
            label: 'users.edit.photo', controlName: 'image', type: 'image',
            url: this.editedEntity.userId ? `/users/${this.editedEntity.userId}/photo` : null,
            disabled: true, width: 12, height: 179
          },
        ]
      },
      { label: 'users.edit.email', controlName: 'email', type: 'text', disabled: true },
      { label: 'users.edit.mobPhone', controlName: 'mobPhone', type: 'text', disabled: true },
      { label: 'users.edit.workPhone', controlName: 'workPhone', type: 'text', disabled: true },
      { label: 'users.edit.intPhone', controlName: 'intPhone', type: 'text', disabled: true },
      { label: 'users.edit.comment', controlName: 'comment', type: 'textarea', disabled: !canEdit },
    ];
  }

}
