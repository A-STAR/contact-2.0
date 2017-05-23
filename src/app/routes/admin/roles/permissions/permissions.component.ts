import {
  Component, Input, OnChanges, SimpleChange, ViewChild, AfterViewInit
} from '@angular/core';

import { TableColumn } from '@swimlane/ngx-datatable';

import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IDisplayProperties } from '../roles.interface';
import { IPermissionModel, IPermissionRole, IPermissionsResponse } from './permissions.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';

import { GridColumnDecoratorService } from '../../../../shared/components/grid/grid.column.decorator.service';
import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { PermissionsService } from './permissions.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent implements AfterViewInit, OnChanges {

  displayProperties: IDisplayProperties = {
    removePermit: false,
    addPermit: false,
    editPermit: false
  };
  private editedPermission: IPermissionModel;

  @ViewChild('permitsGrid') permitsGrid: GridComponent;
  @Input() currentRole: IPermissionRole;

  columns: Array<TableColumn> = [
    { prop: 'id', minWidth: 70, maxWidth: 100 },
    { prop: 'name', minWidth: 200, maxWidth: 350 },
    this.columnDecoratorService.decorateColumn(
      { prop: 'value', minWidth: 70, maxWidth: 100 },
      (permission: IPermissionModel) => this.valueConverterService.deserializeBooleanViewValue(permission)
    ),
    { prop: 'dsc', minWidth: 200 },
    { prop: 'comment' },
  ];

  bottomActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: false, permission: 'PERMIT_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'PERMIT_EDIT' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'PERMIT_DELETE' },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
  ];

  bottomPermitActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  bottomRoleActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.ADD,
  ];

  tabs: Array<any> = [
    {id: 0, title: 'roles.permissions.tab.title', active: true},
  ];

  dataSource: IDataSource = {
    read: '/api/roles/{id}/permits',
    dataKey: 'permits'
  };

  constructor(private permissionsService: PermissionsService,
              private columnDecoratorService: GridColumnDecoratorService,
              private valueConverterService: ValueConverterService) {
  }

  parseFn = (data: IPermissionsResponse) => this.valueConverterService.deserializeSet(data.permits);

  public ngAfterViewInit(): void {
    this.permitsGrid.onRowsChange.subscribe(() => this.refreshToolbar());
    this.refreshGrid();
  }

  public ngOnChanges(changes: {[propertyName: string]: SimpleChange}): void {
    this.refreshGrid();
  }

  onAction(action: IToolbarAction): void {
    this.displayProperties.editPermit = false;
    this.displayProperties.addPermit = false;
    this.displayProperties.removePermit = false;

    switch (action.type) {
      case ToolbarActionTypeEnum.REFRESH:
        this.editedPermission = null;
        this.loadGrid();
        break;
      case ToolbarActionTypeEnum.EDIT:
        this.displayProperties.editPermit = true;
        break;
      case ToolbarActionTypeEnum.ADD:
        this.displayProperties.addPermit = true;
        break;
      case ToolbarActionTypeEnum.REMOVE:
        this.displayProperties.removePermit = true;
        break;
    }
  }

  onBeginEditPermission(): void {
    this.displayProperties.editPermit = true;
  }

  onSelectPermissions(records: IPermissionModel[]): void {
    if (records.length) {
      this.editedPermission = records[0];
    }
    this.refreshToolbar();
  }

  onEditPermission(permission: IPermissionModel): void {
    const permissionId: number = this.editedPermission.id;
    this.permissionsService.editPermission(this.currentRole, permissionId, permission)
      .subscribe(
        () => {
          this.displayProperties.editPermit = false;
          this.refreshGrid();
        },
        // TODO: display & log a message
        err => console.error(err)
      );
  }

  onAddPermissions(addedPermissions: IPermissionModel[]): void {
    const permissionsIds: number [] = addedPermissions.map((rec: IPermissionModel) => rec.id);

    this.permissionsService.addPermission(this.currentRole, permissionsIds)
      .subscribe(
        () => {
          this.displayProperties.addPermit = false;
          this.refreshGrid();
        },
        // TODO: display & log a message
        err => console.error(err)
      );
  }

  onRemovePermission(): void {
    const permissionId: number = this.editedPermission.id;
    this.permissionsService.removePermission(this.currentRole, permissionId)
      .subscribe(
        () => {
          this.displayProperties.removePermit = false;
          this.refreshGrid();
        },
        // TODO: display & log a message
        err => console.error(err)
      );
  }

  private loadGrid(): void {
    this.permitsGrid.load(this.currentRole)
      .subscribe(
        () => {},
        // TODO: display & log a message
        err => console.error(err)
      );
  }

  private refreshGrid(): void {
    if (!this.permitsGrid) {
      return;
    }

    if (this.currentRole) {
      this.loadGrid();
    } else {
      this.permitsGrid.clear();
    }
  }

  private refreshToolbar(): void {
    this.setActionsVisibility(this.bottomRoleActionsGroup, !!this.currentRole);
    this.setActionsVisibility(this.bottomPermitActionsGroup, !!this.editedPermission);

    this.bottomActions.find((action: IToolbarAction) => action.type === ToolbarActionTypeEnum.REFRESH)
      .visible = this.permitsGrid.rows.length > 0;
  }

  private setActionsVisibility(actionTypesGroup: Array<ToolbarActionTypeEnum>, visible: boolean): void {
    actionTypesGroup.forEach((actionType: ToolbarActionTypeEnum) => {
      this.bottomActions.find((action: IToolbarAction) => actionType === action.type).visible = visible;
    });
  }
}
