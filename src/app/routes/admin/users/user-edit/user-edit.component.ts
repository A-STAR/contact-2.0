import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { SelectionActionTypeEnum } from '../../../../shared/components/form/select/select-interfaces';
import { IUser } from '../users.interface';
import { IRolesResponse } from '../../roles/roles/roles.interface';

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

  constructor(private gridService: GridService) {}

  get canSubmit(): boolean {
    return this.form.canSubmit;
  }

  get title(): string {
    return this.user && this.user.id ? `Пользователь: ${this.user.id}` : 'Новый пользователь';
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

  }

  onCancelClick(): void {
    this.close();
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

    return [
      { label: 'Фамилия', controlName: 'lastName', type: 'text', required: true },
      { label: 'Имя', controlName: 'firstName', type: 'text' },
      { label: 'Отчество', controlName: 'middleName', type: 'text' },
      // TODO: insert photo upload control here
      // TODO: do we need separate type 'checkbox' in addition to 'boolean'?
      { label: 'Блокирован', controlName: 'isBlocked', type: 'boolean', required: true },
      { label: 'Логин', controlName: 'login', type: 'text', required: true },
      { label: 'Пароль', controlName: 'password', type: 'text', required: true },
      { label: 'Роль', controlName: 'roleId', type: 'select', required: true, ...roleSelectOptions },
      { label: 'Должность', controlName: 'position', type: 'text' },
      { label: 'Дата начала работы', controlName: 'startWorkDate', type: 'text' },  // calendar
      { label: 'Дата окончания работы', controlName: 'endWorkDate', type: 'text' },  // calendar
      { label: 'Мобильный телефон', controlName: 'mobPhone', type: 'text' },
      { label: 'Рабочий телефон', controlName: 'workPhone', type: 'text' },
      { label: 'Внутренний номер', controlName: 'intPhone', type: 'text' },
      { label: 'Email', controlName: 'email', type: 'text' },
      { label: 'Рабочий адрес', controlName: 'address', type: 'text', required: true },
      { label: 'Язык', controlName: 'langCode', type: 'select', required: true },  // select
      { label: 'Комментарий', controlName: 'comment', type: 'textarea' },
    ];
  }

  private getData(): any {
    return {
      ...this.user,
      roleId: [{ value: this.user.roleId }]  // FIXME: add label
    };
  }

  private close(): void {
    this.user = null;
    this.userChange.emit(null);
  }
}
