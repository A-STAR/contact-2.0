import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IUser } from '../users.interface';

@Component({
  selector: 'app-user-edit',
  templateUrl: 'user-edit.component.html'
})
export class UserEditComponent implements OnInit {
  @Input() user: IUser;
  @Output() userChange: EventEmitter<IUser> = new EventEmitter();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: Array<IDynamicFormControl>;

  error: string = null;

  get canSubmit(): boolean {
    return this.form.canSubmit;
  }

  get title(): string {
    return this.user && this.user.id ? `Пользователь: ${this.user.id}` : 'Новый пользователь';
  }

  ngOnInit(): void {
    this.controls = this.getControls();
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
    return [
      { label: 'Фамилия', controlName: 'lastName', type: 'text', required: true },
      { label: 'Имя', controlName: 'firstName', type: 'text', required: true },
      { label: 'Отчество', controlName: 'middleName', type: 'text', required: true },
      // TODO: insert photo upload control here
      // TODO: do we need separate type 'checkbox' in addition to 'boolean'?
      { label: 'Блокирован', controlName: 'isBlocked', type: 'boolean', required: true },
      { label: 'Логин', controlName: 'login', type: 'text', required: true },
      { label: 'Пароль', controlName: 'password', type: 'text', required: true },
      { label: 'Роль', controlName: 'roleId', type: 'text', required: true },
      { label: 'Должность', controlName: 'position', type: 'text', required: true },
      { label: 'Дата начала работы', controlName: 'startWorkDate', type: 'text', required: true },
      { label: 'Дата окончания работы', controlName: 'endWorkDate', type: 'text', required: true },
      { label: 'Мобильный телефон', controlName: 'mobPhone', type: 'text', required: true },
      { label: 'Рабочий телефон', controlName: 'workPhone', type: 'text', required: true },
      { label: 'Внутренний номер', controlName: 'intPhone', type: 'text', required: true },
      { label: 'Email', controlName: 'email', type: 'text', required: true },
      { label: 'Рабочий адрес', controlName: 'address', type: 'text', required: true },
      { label: 'Язык', controlName: 'langCode', type: 'text', required: true },
      { label: 'Комментарий', controlName: 'comment', type: 'textarea', required: true },
    ];
  }

  private close(): void {
    this.user = null;
    this.userChange.emit(null);
  }
}
