import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { IDynamicFormItem, IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IUser } from '../users.interface';

import { ContentTabService } from '../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { PermissionsService } from '../../roles/permissions.service';
import { UserConstantsService } from '../../../../core/user/constants/user-constants.service';
import { UserLanguagesService } from '../../../../core/user/languages/user-languages.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { password } from '../../../../core/validators/password';

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html'
})
export class UserEditComponent {
  static COMPONENT_NAME = 'UserEditComponent';

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: any;

  private permissions = null;
  private userId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private contentTabService: ContentTabService,
    private gridService: GridService,
    private permissionsService: PermissionsService,
    private router: Router,
    private userConstantsService: UserConstantsService,
    private userLanguagesService: UserLanguagesService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    this.userId = Number((this.activatedRoute.params as any).value.id);

    // TODO(d.maltsev): we probably have to do something with this monster
    Observable.combineLatest(
      this.userPermissionsService.has('USER_EDIT'),
      this.userPermissionsService.has('USER_ROLE_EDIT'),
      this.userPermissionsService.has('USER_LDAP_LOGIN_EDIT'),
      this.userConstantsService.get('UserPassword.MinLength'),
      this.userConstantsService.get('UserPassword.Complexity.Use'),
      this.userLanguagesService.languages.map(this.valueConverterService.valuesToOptions),
      this.permissionsService.roles.map(this.valueConverterService.valuesToOptions),
      this.readUser(this.userId),
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

      const nameBlock = ([
        { label: 'users.edit.lastName', controlName: 'lastName', type: 'text', required: true },
        { label: 'users.edit.firstName', controlName: 'firstName', type: 'text' },
        { label: 'users.edit.middleName', controlName: 'middleName', type: 'text' },
      ] as Array<IDynamicFormControl>).map(control => ({
        ...control,
        disabled: !data.canEditUser
      }));

      const detailsBlock = ([
        { label: 'users.edit.login', controlName: 'login', type: 'text', required: true },
        { label: 'users.edit.password', controlName: 'password', type: 'text', validators: [ passwordValidators ] },
        { label: 'users.edit.ldapLogin', controlName: 'ldapLogin', type: 'text', required: true, disabled: !data.canEditLdap },
        { label: 'users.edit.blocked', controlName: 'isBlocked', type: 'checkbox' },
        { label: 'users.edit.role', controlName: 'roleId', type: 'select', required: true, disabled: !data.canEditRole,
            options: data.roles },
        { label: 'users.edit.position', controlName: 'position', type: 'text' },
        { label: 'users.edit.startWorkDate', controlName: 'startWorkDate', type: 'datepicker' },
        { label: 'users.edit.endWorkDate', controlName: 'endWorkDate', type: 'datepicker' },
        { label: 'users.edit.mobPhone', controlName: 'mobPhone', type: 'text' },
        { label: 'users.edit.workPhone', controlName: 'workPhone', type: 'text' },
        { label: 'users.edit.intPhone', controlName: 'intPhone', type: 'text' },
        { label: 'users.edit.email', controlName: 'email', type: 'text' },
        { label: 'users.edit.address', controlName: 'workAddress', type: 'text' },
        { label: 'users.edit.language', controlName: 'languageId', type: 'select', required: true, options: data.languages },
        { label: 'users.edit.comment', controlName: 'comment', type: 'textarea', disabled: !data.canEditUser },
      ] as Array<IDynamicFormControl>).map(control => ({
        ...control,
        disabled: control.hasOwnProperty('disabled') ? control.disabled : !data.canEditUser
      }));

      this.controls = [
        {
          children: [
            {
              children: nameBlock,
              width: 9
            },
            {
              label: 'users.edit.photo',
              controlName: 'image',
              type: 'image',
              url: this.userId ? `/users/${this.userId}/photo` : null,
              disabled: !data.canEditUser,
              width: 3,
              height: 178
            }
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

      this.formData = this.userId ? {
        ...data.user,
        startWorkDate: this.valueConverterService.isoStringToDate(data.user.startWorkDate as string),
        endWorkDate: this.valueConverterService.isoStringToDate(data.user.endWorkDate as string),
        languageId: data.user.languageId,
        roleId: data.user.roleId,
      } : {
        roleId: 1,
        languageId: 1
      };
    });
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    if (!this.form) {
      return;
    }

    const data = this.toSubmittedValues(this.form.value);

    const action = this.userId ? this.updateUser(this.userId, data) : this.createUser(data);

    // TODO(d.maltsev)
    action
      .take(1)
      .subscribe(response => {
        console.log(response);
      });
  }

  onClose(): void {
    const i = this.contentTabService.getActiveIndex();
    this.router.navigate(['/admin/users'])
      .then(() => this.contentTabService.removeTab(i));
  }

  private toSubmittedValues(value: IUser): any {
    const submittedValue = {
      ...value,
      isBlocked: value.isBlocked ? 1 : 0,
      password: value.password || undefined,
      // TODO(a.poterenko): fix this in select control?
      roleId: Array.isArray(value.roleId) ? value.roleId[0].value : value.roleId,
      startWorkDate: this.valueConverterService.dateToIsoString(value.startWorkDate as Date),
      endWorkDate: this.valueConverterService.dateToIsoString(value.endWorkDate as Date),
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

  // TODO(d.maltsev): user service
  private readUser(userId: number): Observable<any> {
    return this.gridService.read('/api/users')
      .map(response => response.users.find(user => user.id === userId));
  }

  // TODO(d.maltsev): user service
  private createUser(user: IUser): Observable<any> {
    return this.gridService.create('/api/users', {}, user);
  }

  // TODO(d.maltsev): user service
  private updateUser(userId: number, user: IUser): Observable<any> {
    return this.gridService.update('/api/users/{userId}', { userId }, user);
  }
}
