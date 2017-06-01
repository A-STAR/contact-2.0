import { Component, Input } from '@angular/core';
import { ValidatorFn } from '@angular/forms';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IUser } from '../users.interface';

import { ConstantsService } from '../../../../core/constants/constants.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { EntityBaseComponent } from '../../../../shared/components/entity/edit/entity.base.component';

import { password } from '../../../../core/validators/password';

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html'
})
export class UserEditComponent extends EntityBaseComponent<IUser> {
  @Input() roles;
  @Input() languages;

  private canEditUser = false;
  private canEditUserRole = false;

  private passwordValidators: ValidatorFn = null;

  constructor(
    private userPermissionsService: UserPermissionsService,
    private constantsService: ConstantsService
  ) {
    super();
    this.canEditUser = this.userPermissionsService.hasPermission('USER_EDIT');
    this.canEditUserRole = this.userPermissionsService.hasPermission('USER_ROLE_EDIT');
    this.passwordValidators = password(
      !this.editedEntity,
      this.constantsService.get('UserPassword.MinLength') as number,
      this.constantsService.get('UserPassword.Complexity.Use') as boolean
    )
  }

  get canEdit(): boolean {
    return this.canEditUser || this.canEditUserRole;
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      { label: 'users.edit.lastName', controlName: 'lastName', type: 'text', required: true },
      { label: 'users.edit.firstName', controlName: 'firstName', type: 'text' },
      { label: 'users.edit.middleName', controlName: 'middleName', type: 'text' },
      // TODO: insert photo upload control here
      { label: 'users.edit.blocked', controlName: 'isBlocked', type: 'checkbox', required: true },
      { label: 'users.edit.login', controlName: 'login', type: 'text', required: true },
      { label: 'users.edit.password', controlName: 'password', type: 'text', validators: [ this.passwordValidators ] },
      { label: 'users.edit.role', controlName: 'roleId', type: 'select', required: true, disabled: !this.canEditUserRole,
          options: this.roles },
      { label: 'users.edit.position', controlName: 'position', type: 'text' },
      { label: 'users.edit.startWorkDate', controlName: 'startWorkDate', type: 'datepicker' },
      { label: 'users.edit.endWorkDate', controlName: 'endWorkDate', type: 'datepicker' },
      { label: 'users.edit.mobPhone', controlName: 'mobPhone', type: 'text' },
      { label: 'users.edit.workPhone', controlName: 'workPhone', type: 'text' },
      { label: 'users.edit.intPhone', controlName: 'intPhone', type: 'text' },
      { label: 'users.edit.email', controlName: 'email', type: 'text' },
      { label: 'users.edit.address', controlName: 'workAddress', type: 'text' },
      { label: 'users.edit.language', controlName: 'languageId', type: 'select', required: true,
          options: this.languages },
      { label: 'users.edit.comment', controlName: 'comment', type: 'textarea', disabled: !this.canEditUser },
    ].map((control: IDynamicFormControl) => ({
      ...control,
      disabled: control.hasOwnProperty('disabled') ? control.disabled : !this.canEditUser
    }));
  }

  get formData(): any {
    if (!this.editedEntity) {
      return {
        roleId: 1,
        languageId: 1,
      };
    }
    return {
      ...this.editedEntity,
      roleId: this.editedEntity.roleId,
      startWorkDate: this.formatDate(this.editedEntity.startWorkDate),
      endWorkDate: this.formatDate(this.editedEntity.endWorkDate),
      languageId: this.editedEntity.languageId,
    };
  }

  toSubmittedValues(value: IUser): any {
    console.log(value);
    return {
      ...value,
      isBlocked: value.isBlocked ? 1 : 0,
      password: value.password || undefined,
      roleId: value.roleId[0].value,
      startWorkDate: this.toIsoDate(value.startWorkDate),
      endWorkDate: this.toIsoDate(value.endWorkDate),
      languageId: value.languageId[0].value
    };
  }

  private formatDate(date: string): string {
    // TODO: move to a service, format properly
    return date ? (new Date(date)).toLocaleDateString() : '';
  }

  private toIsoDate(date: string): string {
    // TODO: move to a service, use moment.js
    if (!date) {
      return null;
    }
    const ymd = date.split('.');
    return (new Date(parseInt(ymd[2], 10), parseInt(ymd[1], 10) - 1, parseInt(ymd[0], 10))).toISOString();
  }
}
