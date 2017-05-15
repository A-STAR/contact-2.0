import { Component } from '@angular/core';
import { IDataSource } from '../../../shared/components/grid/grid.interface';

@Component({
  moduleId: module.id,
  selector: 'app-users',
  templateUrl: 'users.component.html'
})

export class UsersComponent {
  columns: Array<any> = [
    { name: 'ID', prop: 'id', minWidth: 50, maxWidth: 70, disabled: true },
    { name: 'Логин', prop: 'login', minWidth: 120 },
    { name: 'Фамилия', prop: 'lastName', minWidth: 120 },
    { name: 'Имя', prop: 'firstName', minWidth: 120 },
    { name: 'Отчество', prop: 'middleName', minWidth: 120 },
    { name: 'Должность', prop: 'position', minWidth: 120 },
    { name: 'Роль', prop: 'roleId', minWidth: 80 },  // TODO: display role name
    { name: 'Блокирован', prop: 'isBlocked', minWidth: 100 },  // TODO: display checkbox; display column depending on filter
    { name: 'Мобильный телефон', prop: 'mobPhone', minWidth: 140 },
    { name: 'Рабочий телефон', prop: 'workPhone', minWidth: 140 },
    { name: 'Внутренний номер', prop: 'intPhone', minWidth: 140 },
    { name: 'Email', prop: 'email', minWidth: 120 },
    { name: 'Язык', prop: 'langCode', minWidth: 120 },  // TODO: display language name
  ];

  dataSource: IDataSource = {
    read: '/api/users',
    update: '/api/users/{id}',
    dataKey: 'users',
  };

  parseFn(data: any): any {
    console.log(data);
    return data[this.dataSource.dataKey];
  }
}
