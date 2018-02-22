import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import {
  IDynamicFormItem,
  IDynamicFormControl
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';
import { IUser, IUserEditPermissions } from '@app/routes/admin/users/users.interface';
import { IOption } from '@app/core/converter/value-converter.interface';

import { LookupService } from '@app/core/lookup/lookup.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { UsersService } from '@app/routes/admin/users/users.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { DialogFunctions } from '@app/core/dialog';
import { maxFileSize, password } from '@app/core/validators';

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent extends DialogFunctions {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormItem>;
  dialog: string = null;
  formData: any;

  private userId = Number(this.route.snapshot.paramMap.get('userId'));

  constructor(
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private usersService: UsersService,
    private valueConverterService: ValueConverterService
  ) {
    super();

    combineLatest(
      this.userPermissionsService.has('USER_EDIT'),
      this.userPermissionsService.has('USER_ROLE_EDIT'),
      this.userPermissionsService.has('USER_LDAP_LOGIN_EDIT'),
      this.userConstantsService.get('UserPassword.MinLength'),
      this.userConstantsService.get('UserPassword.Complexity.Use'),
      this.userConstantsService.get('UserPhoto.MaxSize'),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_BRANCHES),
      this.lookupService.lookupAsOptions('languages'),
      this.lookupService.lookupAsOptions('roles'),
      this.userId ? this.usersService.fetchOne(this.userId) : of(null),
      this.usersService.agentAttributes$,
    )
    .pipe(first())
    .subscribe(([
      canEditUser, canEditRole, canEditLdap, passwordMinLength, passwordComplexity, photoMaxSize,
        branchOptions, languages, roles, user, agentAttributes
    ]) => {
      const permissions: IUserEditPermissions = {
        canEditUser: canEditUser,
        canEditRole: canEditRole,
        canEditLdap: canEditLdap,
      };

      const passwordValidator = password(!this.userId, passwordMinLength.valueN, passwordComplexity.valueB);
      const photoValidator = maxFileSize(1e3 * photoMaxSize.valueN);

      this.controls = this.getFormControls(
        branchOptions,
        languages,
        roles,
        passwordValidator,
        photoValidator,
        permissions,
        agentAttributes
      );
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

    const { image, ...user } = this.form.serializedUpdates;

    const operation = this.userId
      ? this.usersService.update(user, image, this.userId)
      : this.usersService.create(user, image);

    operation.subscribe(() => {
      this.usersService.dispatchAction(UsersService.USER_SAVED);
      this.onClose();
    });
  }

  onClose(): void {
    this.routingService.navigate([ '/admin', 'users' ]);
  }

  private getFormControls(
    branchOptions: IOption[],
    languages: IOption[],
    roles: IOption[],
    passwordValidators: ValidatorFn,
    photoValidator: ValidatorFn,
    permissions: IUserEditPermissions,
    agentAttributes: IEntityAttributes
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
      {
        label: 'users.edit.password',
        controlName: 'password',
        type: 'password',
        validators: [ passwordValidators ],
        required: !this.userId,
      },
      { label: 'users.edit.ldapLogin', controlName: 'ldapLogin', type: 'dialog', disabled: !permissions.canEditLdap,
          action: () => this.setDialog('editLdap') },
      { label: 'users.edit.inactive', controlName: 'isInactive', type: 'checkbox' },
      { label: 'users.edit.isAutoReset', controlName: 'isAutoReset', type: 'checkbox' },
      {
        label: 'users.edit.role',
        controlName: 'roleId',
        type: 'select',
        required: true,
        disabled: !permissions.canEditRole,
        options: roles,
        markAsDirty: !this.userId,
      },
      { label: 'users.edit.position', controlName: 'position', type: 'text' },
      { label: 'users.edit.startWorkDate', controlName: 'startWorkDate', type: 'datepicker' },
      { label: 'users.edit.endWorkDate', controlName: 'endWorkDate', type: 'datepicker' },
      {
        label: 'users.edit.branchCode',
        controlName: 'branchCode',
        type: 'select',
        options: branchOptions,
        dictCode: UserDictionariesService.DICTIONARY_BRANCHES,
      },
      { label: 'users.edit.mobPhone', controlName: 'mobPhone', type: 'text' },
      { label: 'users.edit.workPhone', controlName: 'workPhone', type: 'text' },
      { label: 'users.edit.intPhone', controlName: 'intPhone', type: 'text' },
      { label: 'users.edit.email', controlName: 'email', type: 'text' },
      { label: 'users.edit.address', controlName: 'workAddress', type: 'text' },
      {
        label: 'users.edit.language',
        controlName: 'languageId',
        type: 'select',
        required: true,
        options: languages,
        markAsDirty: !this.userId,
      },
      { label: 'users.edit.comment', controlName: 'comment', type: 'textarea', disabled: !permissions.canEditUser },
      ...[
        agentAttributes[87].isUsed
          ? {
            label: 'users.edit.agentId',
            controlName: 'agentId',
            type: 'text',
            required: agentAttributes[87].isMandatory
          } : null,
        agentAttributes[88].isUsed
          ? {
            label: 'users.edit.agentName',
            controlName: 'agentName',
            type: 'text',
            required: agentAttributes[88].isMandatory
          } : null,
        agentAttributes[89].isUsed
          ? {
            label: 'users.edit.agentPassword',
            controlName: 'agentPassword',
            type: 'text',
            required: agentAttributes[89].isMandatory
          } : null,
      ].filter(Boolean)
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
