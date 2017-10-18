import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IDynamicFormItem, IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IUser, IUserEditPermissions } from '../users.interface';
import { IOption } from '../../../../core/converter/value-converter.interface';

import { ContentTabService } from '../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { LookupService } from '../../../../core/lookup/lookup.service';
import { UserConstantsService } from '../../../../core/user/constants/user-constants.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { UsersService } from '../users.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { maxFileSize, password } from '../../../../core/validators';

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
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private lookupService: LookupService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
    private usersService: UsersService,
    private valueConverterService: ValueConverterService,
  ) {
    Observable.combineLatest(
      this.userPermissionsService.has('USER_EDIT'),
      this.userPermissionsService.has('USER_ROLE_EDIT'),
      this.userPermissionsService.has('USER_LDAP_LOGIN_EDIT'),
      this.userConstantsService.get('UserPassword.MinLength'),
      this.userConstantsService.get('UserPassword.Complexity.Use'),
      this.userConstantsService.get('UserPhoto.MaxSize'),
      this.lookupService.languageOptions,
      this.lookupService.roleOptions,
      this.userId ? this.usersService.fetchOne(this.userId) : Observable.of(null),
      (canEditUser, canEditRole, canEditLdap, passwordMinLength, passwordComplexity, photoMaxSize, languages, roles, user) =>
        ({ canEditUser, canEditRole, canEditLdap, passwordMinLength, passwordComplexity, photoMaxSize, languages, roles, user })
    )
    .take(1)
    .subscribe((data: any) => {
      this.permissions = {
        canEditUser: data.canEditUser,
        canEditRole: data.canEditRole,
        canEditLdap: data.canEditLdap,
      };

      const passwordValidator = password(!this.userId, data.passwordMinLength.valueN, data.passwordComplexity.valueB);
      const photoValidator = maxFileSize(1e3 * data.photoMaxSize.valueN);

      this.controls = this.getFormControls(data.languages, data.roles, passwordValidator, photoValidator);
      this.formData = this.getFormData(data.user);
      this.cdRef.markForCheck();
    });
  }

  onLdapDialogAction(ldapLogin: string): void {
    const { form } = this.form;
    form.patchValue({ ldapLogin });
    form.markAsDirty();
    this.onLdapDialogClose();
  }

  onLdapDialogClose(): void {
    this.isLdapUserBeingSelected = false;
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    if (!this.form) {
      return;
    }

    const { image, ...user } = this.form.requestValue;

    let operation: Observable<IUser> = null;
    if (this.userId) {
      operation = this.usersService.update(user, image, this.userId);
    } else {
      operation = this.usersService.create(user, image);
    }
    operation.subscribe(() => this.onClose());
  }

  onClose(): void {
    this.contentTabService.navigate('/admin/users');
  }

  private getFormControls(
    languages: IOption[],
    roles: IOption[],
    passwordValidators: ValidatorFn,
    photoValidator: ValidatorFn
  ): Array<IDynamicFormItem> {
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
      { label: 'users.edit.password', controlName: 'password', type: 'password', validators: [ passwordValidators ] },
      { label: 'users.edit.ldapLogin', controlName: 'ldapLogin', type: 'dialog', disabled: !this.permissions.canEditLdap,
          action: () => this.isLdapUserBeingSelected = true },
      { label: 'users.edit.inactive', controlName: 'isInactive', type: 'checkbox' },
      { label: 'users.edit.isAutoReset', controlName: 'isAutoReset', type: 'checkbox' },
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
          { label: 'users.edit.photo', controlName: 'image', type: 'image', url: photoUrl,
            disabled: !this.permissions.canEditUser, width: 3, height: 178, validators: [ photoValidator ] }
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
    return this.userId
      ? {
        ...user,
        startWorkDate: this.valueConverterService.fromISO(user.startWorkDate as string),
        endWorkDate: this.valueConverterService.fromISO(user.endWorkDate as string),
        languageId: user.languageId,
        roleId: user.roleId,
      }
      : {
        roleId: 1,
        languageId: 1
      };
  }
}
