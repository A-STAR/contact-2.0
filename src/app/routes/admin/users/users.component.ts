import { Component } from '@angular/core';
import { IDataSource } from '../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../shared/components/toolbar/toolbar.interface';
import { GridColumnDecoratorService } from '../../../shared/components/grid/grid.column.decorator.service';
import { MapConverterService } from '../../../core/converter/map/map-converter.service';
import { MapConverterFactoryService } from '../../../core/converter/map/map-converter-factory.service';
import { IUser, IUsersResponse } from './users.interface';

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
    this.columnDecoratorService.decorateColumn(
      { name: 'Роль', prop: 'roleId', minWidth: 80 }, ({ roleId }) => this.roleConverter.map(roleId)
    ),
    this.columnDecoratorService.decorateColumn(
      // TODO: display column depending on filter
      { name: 'Блокирован', prop: 'isBlocked', minWidth: 100 }, ({ isBlocked }) => this.transformIsBlocked(isBlocked)
    ),
    { name: 'Мобильный телефон', prop: 'mobPhone', minWidth: 140 },
    { name: 'Рабочий телефон', prop: 'workPhone', minWidth: 140 },
    { name: 'Внутренний номер', prop: 'intPhone', minWidth: 140 },
    { name: 'Email', prop: 'email', minWidth: 120 },
    this.columnDecoratorService.decorateColumn(
      { name: 'Язык', prop: 'langCode', minWidth: 120 }, ({ langCode }) => this.languageConverter.map(langCode)
    ),
  ];

  dataSource: IDataSource = {
    read: '/api/users',
    update: '/api/users/{id}',
    dataKey: 'users',
  };

  actions: Array<IToolbarAction> = [
    { text: 'Добавить', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'USER_ADD' },
    { text: 'Изменить', type: ToolbarActionTypeEnum.EDIT, visible: false },
  ];

  selectedUser: IUser = null;

  currentUser: IUser = null;

  action: ToolbarActionTypeEnum = null;

  private roleConverter: MapConverterService;
  private languageConverter: MapConverterService;

  constructor(
    private columnDecoratorService: GridColumnDecoratorService,
    private mapConverterFactoryService: MapConverterFactoryService) {

    this.roleConverter = this.mapConverterFactoryService.create('/api/roles', {}, 'roles');

    // FIXME: change to Languages API once it is ready
    this.languageConverter = this.mapConverterFactoryService.create('/api/roles', {}, 'roles');
  }

  transformIsBlocked(isBlocked: number): string {
    // TODO: render checkbox
    return isBlocked ? 'Да' : 'Нет';
  }

  parseFn(data: IUsersResponse): Array<IUser> {
    return data.users;
  }

  isUserBeingCreatedOrEdited(): boolean {
    return !!this.currentUser && !!this.action;
  }

  onAction(action: IToolbarAction): void {
    this.action = action.type;
    switch (action.type) {
      case ToolbarActionTypeEnum.EDIT:
        this.currentUser = this.selectedUser;
        break;
      case ToolbarActionTypeEnum.ADD:
        this.currentUser = this.createEmptyUser();
        break;
    }
  }

  onEdit(user: IUser): void {
    this.action = ToolbarActionTypeEnum.EDIT;
    this.currentUser = this.selectedUser;
  }

  onSelect(users: Array<IUser>): void {
    const user = users[0];
    if (user && user.id && (this.selectedUser && this.selectedUser.id !== user.id || !this.selectedUser)) {
      this.selectUser(user);
    }
  }

  private selectUser(user: IUser): void {
    this.selectedUser = user;
    this.refreshToolbar();
  }

  private refreshToolbar(): void {
    this.actions
      .find((action: IToolbarAction) => action.type === ToolbarActionTypeEnum.EDIT)
      .visible = !!this.selectedUser;
  }

  private createEmptyUser(): IUser {
    return {
      id: null,
      login: '',
      firstName: '',
      middleName: '',
      lastName: '',
      comment: '',
      email: '',
      workPhone: '',
      mobPhone: '',
      intPhone: '',
      workAddress: '',
      position: '',
      startWorkDate: '',
      endWorkDate: '',
      langCode: '',
      isBlocked: false
    };
  }
}
