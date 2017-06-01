import {AfterViewInit, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { IRole } from './roles.interface';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements AfterViewInit {
  @Output() onSelect: EventEmitter<IRole> = new EventEmitter();
  @ViewChild(GridComponent) grid: GridComponent;

  currentRole: IRole = null;
  selectedRole: IRole = null;
  action: ToolbarActionTypeEnum = null;

  toolbarActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'ROLE_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'ROLE_EDIT' },
    { text: 'toolbar.action.copy', type: ToolbarActionTypeEnum.CLONE, visible: false, permission: 'ROLE_COPY' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'ROLE_DELETE' },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
  ];

  toolbarActionsGroup: Array<ToolbarActionTypeEnum> = [
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

  ngAfterViewInit(): void {
    this.grid.onRowsChange.subscribe(() => this.refreshToolbar());
  }

  get isRoleBeingCreatedOrEdited(): boolean {
    return this.currentRole && (this.action === ToolbarActionTypeEnum.ADD || this.action === ToolbarActionTypeEnum.EDIT);
  }

  get isRoleBeingCopied(): boolean {
    return this.currentRole && this.action === ToolbarActionTypeEnum.CLONE;
  }

  get isRoleBeingRemoved(): boolean {
    return this.currentRole && this.action === ToolbarActionTypeEnum.REMOVE;
  }

  parseFn(data: any): Array<IRole> {
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
      case ToolbarActionTypeEnum.REFRESH:
        this.onUpdate();
        break;
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
    this.onSelect.emit(this.selectedRole = null);

    this.grid.load().
      subscribe(
        () => {},
        // TODO: display & log a message
        err => console.error(err)
      );
  }

  callActionByType(type: ToolbarActionTypeEnum): void {
    this.onAction(this.toolbarActions.find((action: IToolbarAction) => type === action.type));
  }

  private selectRole(role: IRole = null): void {
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
    this.setActionsVisibility(this.toolbarActionsGroup, !!this.selectedRole);
  }

  private setActionsVisibility(actionTypesGroup: Array<ToolbarActionTypeEnum>, visible: boolean): void {
    actionTypesGroup.forEach((actionType: ToolbarActionTypeEnum) => {
      this.toolbarActions.find((action: IToolbarAction) => actionType === action.type).visible = visible;
    });

    this.toolbarActions.find((action: IToolbarAction) => action.type === ToolbarActionTypeEnum.REFRESH)
      .visible = this.grid.rows.length > 0;
  }
}
