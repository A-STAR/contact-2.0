import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';

import { password } from '../../../../core/validators/password';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { ConstantsService } from '../../../../core/constants/constants.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { SelectionActionTypeEnum } from '../../../../shared/components/form/select/select-interfaces';
import { IUser } from '../users.interface';
import { IRolesResponse } from '../../roles/roles/roles.interface';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html'
})
export class UserEditComponent implements OnInit {
  @Input() user: IUser;
  @Output() userChange: EventEmitter<IUser> = new EventEmitter();
  @Output() onUpdate: EventEmitter<null> = new EventEmitter();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl>;

  data: any;

  error: string = null;

  canEditUser = false;
  canEditUserRole = false;

  constructor(
    private gridService: GridService,
    private usersService: UsersService,
    private userPermissionsService: UserPermissionsService,
    private constantsService: ConstantsService
  ) {}

  get canEdit(): boolean {
    return this.canEditUser || this.canEditUserRole;
  }

  get canSubmit(): boolean {
    return this.form.canSubmit;
  }

  get title(): string {
    return this.isUpdating ? `Пользователь: ${this.user.id}` : 'Новый пользователь';
  }

  ngOnInit(): void {
    this.canEditUser = this.userPermissionsService.hasPermission('USER_EDIT');
    this.canEditUserRole = this.userPermissionsService.hasPermission('USER_ROLE_EDIT');
    this.controls = this.getControls();
    this.data = this.getData();
  }

  onDisplayChange(event: boolean): void {
    if (event === false) {
      this.close();
    }
  }

  onActionClick(): void {
    const action = this.isUpdating ? this.usersService.save(this.user.id, this.payload) : this.usersService.create(this.payload);
    action
      .subscribe(
        data => {
          if (data.success) {
            this.onUpdate.emit();
            this.close();
          } else {
            this.error = data.message;
          }
        },
        error => this.error = 'validation.DEFAULT_ERROR_MESSAGE'
      );
  }

  onCancelClick(): void {
    this.close();
  }

  private get isUpdating(): boolean {
    return !!(this.user && this.user.id);
  }

  private getControls(): Array<IDynamicFormControl> {
    const roleSelectOptions = {
      cachingOptions: true,
      lazyOptions: this.gridService
        .read('/api/roles')
        .map((data: IRolesResponse) => data.roles.map(role => ({ label: role.name, value: role.id }))),
      optionsActions: [
        { text: 'Выберите роль', type: SelectionActionTypeEnum.SORT}
      ]
    };

    const passwordValidation = {
      validators: [
        password(
          this.constantsService.get('UserPassword.MinLength') as number,
          this.constantsService.get('UserPassword.Complexity.Use') as boolean
        ),
      ]
    };

    return [
      { label: 'Фамилия', controlName: 'lastName', type: 'text', required: true, disabled: !this.canEditUser },
      { label: 'Имя', controlName: 'firstName', type: 'text', disabled: !this.canEditUser },
      { label: 'Отчество', controlName: 'middleName', type: 'text', disabled: !this.canEditUser },
      // TODO: insert photo upload control here
      { label: 'Блокирован', controlName: 'isBlocked', type: 'checkbox', required: true, disabled: !this.canEditUser },
      { label: 'Логин', controlName: 'login', type: 'text', required: true, disabled: !this.canEditUser },
      { label: 'Пароль', controlName: 'password', type: 'text', disabled: !this.canEditUser, ...passwordValidation },
      {
        label: 'Роль',
        controlName: 'roleId',
        type: 'select',
        required: true,
        loadLazyItemsOnInit: true,
        disabled: !this.canEditUserRole,
        ...roleSelectOptions
      },
      { label: 'Должность', controlName: 'position', type: 'text', disabled: !this.canEditUser },
      { label: 'Дата начала работы', controlName: 'startWorkDate', type: 'datepicker', disabled: !this.canEditUser },
      { label: 'Дата окончания работы', controlName: 'endWorkDate', type: 'datepicker', disabled: !this.canEditUser },
      { label: 'Мобильный телефон', controlName: 'mobPhone', type: 'text', disabled: !this.canEditUser },
      { label: 'Рабочий телефон', controlName: 'workPhone', type: 'text', disabled: !this.canEditUser },
      { label: 'Внутренний номер', controlName: 'intPhone', type: 'text', disabled: !this.canEditUser },
      { label: 'Email', controlName: 'email', type: 'text', disabled: !this.canEditUser },
      { label: 'Рабочий адрес', controlName: 'address', type: 'text', disabled: !this.canEditUser },
      {
        label: 'Язык',
        controlName: 'languageId',
        type: 'select',
        required: true,
        disabled: !this.canEditUser,
        cachingOptions: true,
        loadLazyItemsOnInit: true,
        lazyOptions: this.usersService.getLanguages()
      },
      { label: 'Комментарий', controlName: 'comment', type: 'textarea', disabled: !this.canEditUser },
    ];
  }

  private getData(): any {
    return {
      ...this.user,
      roleId: [{ value: this.user.roleId }],
      startWorkDate: this.formatDate(this.user.startWorkDate),
      endWorkDate: this.formatDate(this.user.endWorkDate),
      languageId: [{ value: this.user.languageId }]
    };
  }

  private get payload(): IUser {
    const value = this.form.value;
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

  private close(): void {
    this.user = null;
    this.userChange.emit(null);
  }
}
