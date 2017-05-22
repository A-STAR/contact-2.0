import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { IRole } from './roles.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent {
  @Output() onSelect: EventEmitter<IRole> = new EventEmitter();
  @ViewChild(GridComponent) grid: GridComponent;

  currentRole: IRole = null;
  selectedRole: IRole = null;
  action: ToolbarActionTypeEnum = null;

  bottomActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'ROLE_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'ROLE_EDIT' },
    { text: 'toolbar.action.copy', type: ToolbarActionTypeEnum.CLONE, visible: false, permission: 'ROLE_COPY' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'ROLE_DELETE' },
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.CLONE,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<any> = [
    { prop: 'id', minWidth: 30, maxWidth: 70 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'comment', width: 200 },
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

  parseFn(data): Array<IRole> {
    const { dataKey } = this.dataSource;
    return data[dataKey] || [];
  }

  onSelectedRowChange(roles: Array<IRole>): void {
    const role = roles[0];
    if (role && role.id && (this.selectedRole && this.selectedRole.id !== role.id || !this.selectedRole)) {
      this.selectRole(role);
    }
  }

  onEdit(role: IRole): void {
    this.action = ToolbarActionTypeEnum.EDIT;
    this.currentRole = this.selectedRole;
  }

  onAction(action: IToolbarAction): void {
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

  onUpdate(): void {
    this.selectedRole = null;
    this.grid.load().
      subscribe(
        () => this.refreshToolbar(),
        // TODO: display & log a message
        err => console.error(err)
      );
  }

  callActionByType(type: ToolbarActionTypeEnum): void {
    this.onAction(this.bottomActions.find((action: IToolbarAction) => type === action.type));
  }

  private selectRole(role = null): void {
    this.selectedRole = role;
    this.onSelect.emit(role);
    this.refreshToolbar();
  }

  private createEmptyRole(): IRole {
    return {
      id: null,
      name: '',
      comment: ''
    };
  }

  private refreshToolbar(): void {
    this.setActionsVisibility(this.bottomActionsGroup, !!this.selectedRole);
  }

  private setActionsVisibility(actionTypesGroup: Array<ToolbarActionTypeEnum>, visible: boolean): void {
    actionTypesGroup.forEach((actionType: ToolbarActionTypeEnum) => {
      this.bottomActions.find((action: IToolbarAction) => actionType === action.type).visible = visible;
    });
  }
}
