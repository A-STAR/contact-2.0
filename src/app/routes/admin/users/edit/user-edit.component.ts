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

import { DialogFunctions } from '../../../../core/dialog';
import { maxFileSize, password } from '../../../../core/validators';

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent extends DialogFunctions {
  static COMPONENT_NAME = 'UserEditComponent';

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem>;
  dialog: string = null;
  formData: any;

  private userId = Number((this.activatedRoute.params as any).value.id);

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
    super();

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
    )
    .take(1)
    .subscribe(([
      canEditUser, canEditRole, canEditLdap, passwordMinLength, passwordComplexity, photoMaxSize, languages, roles, user
    ]) => {
      const permissions: IUserEditPermissions = {
        canEditUser: canEditUser,
        canEditRole: canEditRole,
        canEditLdap: canEditLdap,
      };

      const passwordValidator = password(!this.userId, passwordMinLength.valueN, passwordComplexity.valueB);
      const photoValidator = maxFileSize(1e3 * photoMaxSize.valueN);

      this.controls = this.getFormControls(languages, roles, passwordValidator, photoValidator, permissions);
      this.formData = this.getFormData(user);
      this.cdRef.markForCheck();
    });
  }

  onLdapDialogAction(ldapLogin: string): void {
    const { form } = this.form;
    form.patchValue({ ldapLogin });
    form.markAsDirty();
    this.onCloseDialog();
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    if (!this.form) {
      return;
    }

    const { image, ...user } = this.form.requestValue;

    const operation = this.userId
      ? this.usersService.update(user, image, this.userId)
      : this.usersService.create(user, image);
    operation.subscribe(() => this.onClose());
  }

  onClose(): void {
    this.contentTabService.navigate('/admin/users');
  }

  private getFormControls(
    languages: IOption[],
    roles: IOption[],
    passwordValidators: ValidatorFn,
    photoValidator: ValidatorFn,
    permissions: IUserEditPermissions
  ): Array<IDynamicFormItem> {
    const photoUrl = this.userId ? `/users/${this.userId}/photo` : null;

    const nameBlock = ([
      { label: 'users.edit.lastName', controlName: 'lastName', type: 'text', required: true },
      { label: 'users.edit.firstName', controlName: 'firstName', type: 'text' },
      { label: 'users.edit.middleName', controlName: 'middleName', type: 'text' },
    ] as Array<IDynamicFormControl>).map(control => ({
      ...control,
      disabled: !permissions.canEditUser
    }));

    const detailsBlock = ([
      { label: 'users.edit.login', controlName: 'login', type: 'text', required: true },
      { label: 'users.edit.password', controlName: 'password', type: 'password', validators: [ passwordValidators ] },
      { label: 'users.edit.ldapLogin', controlName: 'ldapLogin', type: 'dialog', disabled: !permissions.canEditLdap,
          action: () => this.setDialog('editLdap') },
      { label: 'users.edit.inactive', controlName: 'isInactive', type: 'checkbox' },
      { label: 'users.edit.isAutoReset', controlName: 'isAutoReset', type: 'checkbox' },
      { label: 'users.edit.role', controlName: 'roleId', type: 'select', required: true, disabled: !permissions.canEditRole,
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
      { label: 'users.edit.comment', controlName: 'comment', type: 'textarea', disabled: !permissions.canEditUser },
    ] as Array<IDynamicFormControl>).map(control => ({
      ...control,
      disabled: control.hasOwnProperty('disabled') ? control.disabled : !permissions.canEditUser
    }));

    return [
      {
        children: [
          { children: nameBlock, width: 9 },
          { label: 'users.edit.photo', controlName: 'image', type: 'image', url: photoUrl,
            disabled: !permissions.canEditUser, width: 3, height: 178, validators: [ photoValidator ] }
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
        startWorkDate: this.valueConverterService.fromISO(<string>user.startWorkDate),
        endWorkDate: this.valueConverterService.fromISO(<string>user.endWorkDate),
        languageId: user.languageId,
        roleId: user.roleId,
      }
      : {
        roleId: 1,
        languageId: 1
      };
  }
}
