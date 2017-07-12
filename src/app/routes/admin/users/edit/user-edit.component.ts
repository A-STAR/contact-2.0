import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ValidatorFn } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IDynamicFormItem, IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IUser, IUserEditPermissions } from '../users.interface';
import { IOption } from '../../../../core/converter/value/value-converter.interface';

import { ContentTabService } from '../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { PermissionsService } from '../../roles/permissions.service';
import { UserConstantsService } from '../../../../core/user/constants/user-constants.service';
import { UserLanguagesService } from '../../../../core/user/languages/user-languages.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { UsersService } from '../users.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { password } from '../../../../core/validators/password';

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent {
  static COMPONENT_NAME = 'UserEditComponent';

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem>;
  formData: any;

  isLdapUserBeingSelected = false;

  // TODO(d.maltsev): stronger typing
  private userId = Number((this.activatedRoute.params as any).value.id);
  private permissions: IUserEditPermissions;

  constructor(
    private actions: Actions,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private permissionsService: PermissionsService,
    private userConstantsService: UserConstantsService,
    private userLanguagesService: UserLanguagesService,
    private userPermissionsService: UserPermissionsService,
    private usersService: UsersService,
    private valueConverterService: ValueConverterService,
  ) {
    this.usersService.fetchOne(this.userId);

    Observable.combineLatest(
      this.userPermissionsService.has('USER_EDIT'),
      this.userPermissionsService.has('USER_ROLE_EDIT'),
      this.userPermissionsService.has('USER_LDAP_LOGIN_EDIT'),
      this.userConstantsService.get('UserPassword.MinLength'),
      this.userConstantsService.get('UserPassword.Complexity.Use'),
      this.userLanguagesService.languages.map(this.valueConverterService.valuesToOptions),
      this.permissionsService.roles.map(this.valueConverterService.valuesToOptions),
      this.actions.ofType(UsersService.USERS_FETCH_SUCCESS).map(action => action.payload.user),
      (canEditUser, canEditRole, canEditLdap, passwordMinLength, passwordComplexity, languages, roles, user) => ({
        canEditUser,
        canEditRole,
        canEditLdap,
        passwordMinLength,
        passwordComplexity,
        languages,
        roles,
        user,
      })
    )
    .take(1)
    .subscribe((data: any) => {
      this.permissions = {
        canEditUser: data.canEditUser,
        canEditRole: data.canEditRole,
        canEditLdap: data.canEditLdap,
      };

      const passwordValidators = password(
        !this.userId,
        data.passwordMinLength.valueN,
        data.passwordComplexity.valueB
      );

      this.controls = this.getFormControls(data.languages, data.roles, passwordValidators);
      this.formData = this.getFormData(data.user);
      this.changeDetectorRef.markForCheck();
    });
  }

  private getFormControls(languages: IOption[], roles: IOption[], passwordValidators: ValidatorFn): Array<IDynamicFormItem> {
    const photoUrl = this.userId ? `/users/${this.userId}/photo` : null;

    const nameBlock = ([
      { label: 'users.edit.lastName', controlName: 'lastName', type: 'text', required: true },
      { label: 'users.edit.firstName', controlName: 'firstName', type: 'text' },
      { label: 'users.edit.middleName', controlName: 'middleName', type: 'text' },
    ] as Array<IDynamicFormControl>).map(control => ({
      ...control,
      disabled: !this.permissions.canEditUser
    }));

    const detailsBlock = ([
      { label: 'users.edit.login', controlName: 'login', type: 'text', required: true },
      { label: 'users.edit.password', controlName: 'password', type: 'text', validators: [ passwordValidators ] },
      // TODO(d.maltsev): consider using control value accessor in app-popup-input
      { label: 'users.edit.ldapLogin', controlName: 'ldapLogin', type: 'dialog', required: true, disabled: !this.permissions.canEditLdap,
          action: () => this.isLdapUserBeingSelected = true, value: Observable.of('foo') },
      { label: 'users.edit.blocked', controlName: 'isBlocked', type: 'checkbox' },
      { label: 'users.edit.role', controlName: 'roleId', type: 'select', required: true, disabled: !this.permissions.canEditRole,
          options: roles },
      { label: 'users.edit.position', controlName: 'position', type: 'text' },
      { label: 'users.edit.startWorkDate', controlName: 'startWorkDate', type: 'datepicker' },
      { label: 'users.edit.endWorkDate', controlName: 'endWorkDate', type: 'datepicker' },
      { label: 'users.edit.mobPhone', controlName: 'mobPhone', type: 'text' },
      { label: 'users.edit.workPhone', controlName: 'workPhone', type: 'text' },
      { label: 'users.edit.intPhone', controlName: 'intPhone', type: 'text' },
      { label: 'users.edit.email', controlName: 'email', type: 'text' },
      { label: 'users.edit.address', controlName: 'workAddress', type: 'text' },
      { label: 'users.edit.language', controlName: 'languageId', type: 'select', required: true, options: languages },
      { label: 'users.edit.comment', controlName: 'comment', type: 'textarea', disabled: !this.permissions.canEditUser },
    ] as Array<IDynamicFormControl>).map(control => ({
      ...control,
      disabled: control.hasOwnProperty('disabled') ? control.disabled : !this.permissions.canEditUser
    }));

    return [
      {
        children: [
          { children: nameBlock, width: 9 },
          { label: 'users.edit.photo', controlName: 'image', type: 'image', url: photoUrl, disabled: !this.permissions.canEditUser,
              width: 3, height: 178 }
        ],
        collapsible: true,
        title: 'users.edit.personalData'
      },
      {
        children: detailsBlock,
        collapsible: true,
        title: 'users.edit.details'
      }
    ] as Array<IDynamicFormItem>;
  }

  private getFormData(user: IUser): Partial<IUser> {
    return this.userId ? {
      ...user,
      startWorkDate: this.valueConverterService.fromISO(user.startWorkDate as string),
      endWorkDate: this.valueConverterService.fromISO(user.endWorkDate as string),
      languageId: user.languageId,
      roleId: user.roleId,
    } : {
      roleId: 1,
      languageId: 1
    };
  }

  onApplyLdapUser(): void {
    // TODO(d.maltsev)
    this.onCloseLdapUser();
  }

  onCloseLdapUser(): void {
    this.isLdapUserBeingSelected = false;
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    if (!this.form) {
      return;
    }

    const { image, ...user } = this.toSubmittedValues(this.form.value);

    if (this.userId) {
      this.usersService.update(user, image, this.userId);
    } else {
      this.usersService.create(user, image);
    }

    this.actions.ofType(UsersService.USER_UPDATE_SUCCESS)
      .take(1)
      .do(() => this.onClose())
      .subscribe();
  }

  onClose(): void {
    this.contentTabService.navigate('/admin/users');
  }

  private toSubmittedValues(value: IUser): any {
    const submittedValue = {
      ...value,
      isBlocked: value.isBlocked ? 1 : 0,
      password: value.password || undefined,
      // TODO(a.poterenko): fix this in select control?
      roleId: Array.isArray(value.roleId) ? value.roleId[0].value : value.roleId,
      startWorkDate: this.valueConverterService.toISO(value.startWorkDate as Date),
      endWorkDate: this.valueConverterService.toISO(value.endWorkDate as Date),
      // TODO(a.poterenko): fix this in select control?
      languageId: Array.isArray(value.languageId) ? value.languageId[0].value : value.languageId
    };

    const { roleId, ldapLogin, ...user } = submittedValue;

    return {
      ...(this.permissions.canEditUser ? user : {}),
      ...(this.permissions.canEditRole ? { roleId } : {}),
      ...(this.permissions.canEditLdap ? { ldapLogin } : {}),
    };
  }
}
