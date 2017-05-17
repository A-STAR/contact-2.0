import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';

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
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl>;

  data: any;

  error: string = null;

  constructor(private gridService: GridService, private usersService: UsersService) {}

  get canSubmit(): boolean {
    return this.form.canSubmit;
  }

  get title(): string {
    return this.isUpdating ? `Пользователь: ${this.user.id}` : 'Новый пользователь';
  }

  ngOnInit(): void {
    this.controls = this.getControls();
    this.data = this.getData();
  }

  onDisplayChange(event: boolean): void {
    if (event === false) {
      this.close();
    }
  }

  onActionClick(): void {
    const action = this.isUpdating ? this.usersService.save : this.usersService.create;

    console.log(this.form.value);

    /*
    action(this.form.value)
      .subscribe(r => console.log(r));
    */
  }

  onCancelClick(): void {
    this.close();
  }

  private get isUpdating(): boolean {
    return !!(this.user && this.user.id);
  }

  private getControls(): Array<IDynamicFormControl> {
    // TODO: persist value when options are fetched
    const roleSelectOptions = {
      cachingOptions: true,
      lazyOptions: this.gridService
        .read('/api/roles')
        .map((data: IRolesResponse) => data.roles.map(role => ({ label: role.name, value: role.id }))),
      optionsActions: [
        { text: 'Выберите роль', type: SelectionActionTypeEnum.SORT}
      ]
    };

    return [
      { label: 'Фамилия', controlName: 'lastName', type: 'text', required: true },
      { label: 'Имя', controlName: 'firstName', type: 'text' },
      { label: 'Отчество', controlName: 'middleName', type: 'text' },
      // TODO: insert photo upload control here
      // TODO: do we need separate type 'checkbox' in addition to 'boolean'?
      { label: 'Блокирован', controlName: 'isBlocked', type: 'boolean', required: true },
      { label: 'Логин', controlName: 'login', type: 'text', required: true },
      { label: 'Пароль', controlName: 'password', type: 'text' },
      { label: 'Роль', controlName: 'roleId', type: 'select', required: true, ...roleSelectOptions },
      { label: 'Должность', controlName: 'position', type: 'text' },
      { label: 'Дата начала работы', controlName: 'startWorkDate', type: 'datepicker' },
      { label: 'Дата окончания работы', controlName: 'endWorkDate', type: 'datepicker' },
      { label: 'Мобильный телефон', controlName: 'mobPhone', type: 'text' },
      { label: 'Рабочий телефон', controlName: 'workPhone', type: 'text' },
      { label: 'Внутренний номер', controlName: 'intPhone', type: 'text' },
      { label: 'Email', controlName: 'email', type: 'text' },
      { label: 'Рабочий адрес', controlName: 'address', type: 'text' },
      // FIXME: change to language options once the API is ready
      { label: 'Язык', controlName: 'langCode', type: 'select', required: true, ...roleSelectOptions },
      { label: 'Комментарий', controlName: 'comment', type: 'textarea' },
    ];
  }

  private getData(): any {
    return {
      ...this.user,
      // isBlocked: this.user.isBlocked ? 1 : 0,
      // FIXME: add label
      roleId: [{ value: this.user.roleId }],
      // TODO: format properly
      startWorkDate: this.formatDate(this.user.startWorkDate),
      endWorkDate: this.formatDate(this.user.endWorkDate),
      // FIXME: change to language code once the API is ready
      langCode: [{ value: this.user.roleId }]
    };
  }

  private formatDate(date: string): string {
    return date ? (new Date(date)).toLocaleDateString() : '';
  }

  private close(): void {
    this.user = null;
    this.userChange.emit(null);
  }
}
