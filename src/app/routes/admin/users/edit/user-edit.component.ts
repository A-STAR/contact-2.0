import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IDynamicFormItem, IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IUser } from '../users.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { PermissionsService } from '../../../../core/permissions/permissions.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

import { EntityBaseComponent } from '../../../../shared/components/entity/edit/entity.base.component';

import { password } from '../../../../core/validators/password';

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html'
})
export class UserEditComponent extends EntityBaseComponent<IUser> implements OnInit, OnDestroy {
  @Input() roles;
  @Input() languages;

  @Input() passwordMinLength: number;
  @Input() passwordComplexity: boolean;

  userPhotoUrl$: Observable<string>;

  private canEditUser = false;
  private canEditUserRole = false;

  private editUserSub: Subscription;
  private editUserRoleSub: Subscription;

  private passwordValidators: ValidatorFn = null;

  constructor(
    private gridService: GridService,
    private permissionsService: PermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.editUserSub = this.permissionsService.hasPermission('USER_EDIT')
      .subscribe(permission => {
        this.canEditUser = permission;
      });
    this.editUserRoleSub = this.permissionsService.hasPermission('USER_ROLE_EDIT')
      .subscribe(permission => {
        this.canEditUserRole = permission;
      });

    this.passwordValidators = password(
      !this.editedEntity,
      this.passwordMinLength,
      this.passwordComplexity
    );

    super.ngOnInit();
  }

  get canEdit(): boolean {
    return this.canEditUser || this.canEditUserRole;
  }

  protected getControls(): Array<IDynamicFormItem> {
    const userId = this.editedEntity && this.editedEntity.id;

    const nameBlock = ([
      { label: 'users.edit.lastName', controlName: 'lastName', type: 'text', required: true },
      { label: 'users.edit.firstName', controlName: 'firstName', type: 'text' },
      { label: 'users.edit.middleName', controlName: 'middleName', type: 'text' },
      { label: 'users.edit.blocked', controlName: 'isBlocked', type: 'checkbox' },
    ] as Array<IDynamicFormControl>).map(control => ({
      ...control,
      disabled: !this.canEditUser
    }));

    const detailsBlock = ([
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
      { label: 'users.edit.language', controlName: 'languageId', type: 'select', required: true, options: this.languages },
      { label: 'users.edit.comment', controlName: 'comment', type: 'textarea', disabled: !this.canEditUser },
    ] as Array<IDynamicFormControl>).map(control => ({
      ...control,
      disabled: control.hasOwnProperty('disabled') ? control.disabled : !this.canEditUser
    }));

    return [
      {
        children: [
          {
            children: nameBlock,
            width: 8
          },
          {
            label: 'users.edit.photo',
            controlName: 'image',
            type: 'image',
            url: userId ? `/users/${userId}/photo` : null,
            width: 4,
            height: 178
          }
        ]
      },
      ...detailsBlock
    ] as Array<IDynamicFormItem>;
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
      startWorkDate: this.valueConverterService.formatDate(this.editedEntity.startWorkDate),
      endWorkDate: this.valueConverterService.formatDate(this.editedEntity.endWorkDate),
      languageId: this.editedEntity.languageId,
    };
  }

  toSubmittedValues(value: IUser): any {
    return {
      ...value,
      isBlocked: value.isBlocked ? 1 : 0,
      password: value.password || undefined,
      // TODO(a.poterenko): fix this in select control?
      roleId: Array.isArray(value.roleId) ? value.roleId[0].value : value.roleId,
      startWorkDate: this.valueConverterService.valueToIsoDate(value.startWorkDate),
      endWorkDate: this.valueConverterService.valueToIsoDate(value.endWorkDate),
      // TODO(a.poterenko): fix this in select control?
      languageId: Array.isArray(value.languageId) ? value.languageId[0].value : value.languageId
    };
  }

  ngOnDestroy(): void {
    this.editUserSub.unsubscribe();
    this.editUserRoleSub.unsubscribe();
  }
}
