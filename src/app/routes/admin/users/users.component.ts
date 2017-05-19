import { Component, ViewChild } from '@angular/core';

import { ConstantsService } from '../../../core/constants/constants.service';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { GridColumnDecoratorService } from '../../../shared/components/grid/grid.column.decorator.service';
import { MapConverterService } from '../../../core/converter/map/map-converter.service';
import { MapConverterFactoryService } from '../../../core/converter/map/map-converter-factory.service';
import { IDataSource } from '../../../shared/components/grid/grid.interface';
import { IUser, IUsersResponse } from './users.interface';
import { IToolbarAction, ToolbarActionTypeEnum, ToolbarControlEnum } from '../../../shared/components/toolbar/toolbar.interface';

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html'
})
export class UsersComponent {
  @ViewChild(GridComponent) grid: GridComponent;

  columns: Array<any> = [
    { name: 'Ид', prop: 'id', minWidth: 50, maxWidth: 70, disabled: true },
    { name: 'Логин', prop: 'login', minWidth: 120 },
    { name: 'Фамилия', prop: 'lastName', minWidth: 120 },
    { name: 'Имя', prop: 'firstName', minWidth: 120 },
    { name: 'Отчество', prop: 'middleName', minWidth: 120 },
    { name: 'Должность', prop: 'position', minWidth: 120 },
    this.columnDecoratorService.decorateColumn(
      { name: 'Роль', prop: 'roleId', minWidth: 100 }, ({ roleId }) => this.roleConverter.map(roleId)
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
      { name: 'Язык', prop: 'langCode', minWidth: 120 },
      // TODO: use language converter when the API is ready
      // ({ langCode }) => this.languageConverter.map(langCode)
      ({ langCode }) => {
        switch (langCode) {
          case 1: return 'Русский';
          case 2: return 'English';
        }
      }
    ),
  ];

  dataSource: IDataSource = {
    read: '/api/users',
    update: '/api/users/{id}',
    dataKey: 'users',
  };

  displayBlockedUsers = false;

  actions: Array<IToolbarAction> = [
    { text: 'TOOLBAR.ACTION.ADD', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'USER_ADD' },
    { text: 'TOOLBAR.ACTION.EDIT', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: ['USER_EDIT', 'USER_ROLE_EDIT'] },
    {
      text: 'users.toolbar.action.show_blocked_users',
      type: 10,
      visible: true,
      control: ToolbarControlEnum.CHECKBOX,
      value: this.displayBlockedUsers
    }
  ];

  selectedUser: IUser = null;

  currentUser: IUser = null;

  action: ToolbarActionTypeEnum = null;

  private roleConverter: MapConverterService;
  private languageConverter: MapConverterService;

  constructor(
    private constantsService: ConstantsService,
    private columnDecoratorService: GridColumnDecoratorService,
    private mapConverterFactoryService: MapConverterFactoryService) {

    this.roleConverter = this.mapConverterFactoryService.create('/api/roles', {}, 'roles');

    // FIXME: change to Languages API once it is ready
    this.languageConverter = this.mapConverterFactoryService.create('/api/roles', {}, 'roles');
    this.filter = this.filter.bind(this);
  }

  filter(user: IUser): boolean {
    return !user.isBlocked || this.displayBlockedUsers;
  }

  transformIsBlocked(isBlocked: number): string {
    // TODO: render checkbox
    return isBlocked ? 'Да' : 'Нет';
  }

  parseFn(data: IUsersResponse): Array<IUser> {
    return data.users;
  }

  get isUserBeingCreatedOrEdited(): boolean {
    return this.currentUser && this.action !== null;
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
      // FIXME omg!
      case 10:
        this.displayBlockedUsers = action.value;
        break;
    }
  }

  onEdit(user: IUser): void {
    this.action = ToolbarActionTypeEnum.EDIT;
    this.currentUser = this.selectedUser;
  }

  onUpdate(): void {
    this.selectedUser = null;
    this.grid.load().
      subscribe(
        () => this.refreshToolbar(),
        // TODO: display & log a message
        err => console.error(err)
      );
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
      roleId: null,
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
      langCode: null,
      isBlocked: false
    };
  }
}
