import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { IRoleRecord } from './roles.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent {
  @Output() onSelect: EventEmitter<IRoleRecord> = new EventEmitter();
  @ViewChild(GridComponent) grid: GridComponent;

  currentRole: IRoleRecord = null;
  selectedRole: IRoleRecord = null;
  action: ToolbarActionTypeEnum = null;

  bottomActions: Array<IToolbarAction> = [
    { text: 'Добавить', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'ROLE_ADD' },
    { text: 'Изменить', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'ROLE_EDIT' },
    { text: 'Копировать', type: ToolbarActionTypeEnum.CLONE, visible: false, permission: 'ROLE_COPY' },
    { text: 'Удалить', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'ROLE_DELETE' },
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.CLONE,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<any> = [
    { name: 'ID', prop: 'id', minWidth: 30, maxWidth: 70 },
    { name: 'Название', prop: 'name', maxWidth: 400 },
    { name: 'Комментарий', prop: 'comment', width: 200 },
  ];

  dataSource: IDataSource = {
    read: '/api/roles',
    update: '/api/roles',
    dataKey: 'roles',
  };

  get isRoleBeingCreatedOrEdited(): boolean {
    return this.currentRole && (this.action === ToolbarActionTypeEnum.ADD || this.action === ToolbarActionTypeEnum.EDIT);
  }

  get isRoleBeingCopied(): boolean {
    return this.currentRole && this.action === ToolbarActionTypeEnum.CLONE;
  }

  get isRoleBeingRemoved(): boolean {
    return this.currentRole && this.action === ToolbarActionTypeEnum.REMOVE;
  }

  parseFn(data): Array<IRoleRecord> {
    const { dataKey } = this.dataSource;
    return data[dataKey] || [];
  }

  onSelectedRowChange(roles: Array<IRoleRecord>) {
    const role = roles[0];
    if (role && role.id && (this.selectedRole && this.selectedRole.id !== role.id || !this.selectedRole)) {
      this.selectRole(role);
    }
  }

  onEdit(role: IRoleRecord) {
    this.action = ToolbarActionTypeEnum.EDIT;
    this.currentRole = this.selectedRole;
  }

  onAction(action: IToolbarAction) {
    this.action = action.type;
    switch (action.type) {
      case ToolbarActionTypeEnum.EDIT:
        this.currentRole = this.selectedRole;
        break;
      case ToolbarActionTypeEnum.REMOVE:
        this.currentRole = this.selectedRole;
        break;
      case ToolbarActionTypeEnum.ADD:
      case ToolbarActionTypeEnum.CLONE:
        this.currentRole = this.createEmptyRole();
        break;
    }
  }

  onUpdate() {
    this.selectRole(null);
    this.grid
      .load()
      .then(() => this.refreshToolbar());
  }

  callActionByType(type: ToolbarActionTypeEnum) {
    this.onAction(this.bottomActions.find((action: IToolbarAction) => type === action.type));
  }

  private selectRole(role = null) {
    this.selectedRole = role;
    this.onSelect.emit(role);
    this.refreshToolbar();
  }

  private createEmptyRole(): IRoleRecord {
    return {
      id: null,
      name: '',
      comment: ''
    };
  }

  private refreshToolbar() {
    this.setActionsVisibility(this.bottomActionsGroup, !!this.selectedRole);
  }

  private setActionsVisibility(actionTypesGroup: Array<ToolbarActionTypeEnum>, visible: boolean) {
    actionTypesGroup.forEach((actionType: ToolbarActionTypeEnum) => {
      this.bottomActions.find((action: IToolbarAction) => actionType === action.type).visible = visible;
    });
  }
}
