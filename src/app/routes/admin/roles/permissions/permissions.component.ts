import {
  Component, EventEmitter, Input, OnChanges, Output, SimpleChange, ViewChild, AfterViewInit
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { TableColumn } from '@swimlane/ngx-datatable';


import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridColumnDecoratorService } from '../../../../shared/components/grid/grid.column.decorator.service';

import { IPermissionModel, IPermissionRole } from './permissions.interface';
import { BasePermissionsComponent } from './base.permissions.component';
import { IDisplayProperties } from '../roles.interface';
import { PermissionsService } from './permissions.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent extends BasePermissionsComponent implements AfterViewInit, OnChanges {

  displayProperties: IDisplayProperties = {
    removePermit: false,
    addPermit: false,
    editPermit: false
  };
  private editedPermission: IPermissionModel;

  @ViewChild('permitsGrid') permitsGrid: GridComponent;
  @Input() currentRole: IPermissionRole;
  @Output() cloneRole: EventEmitter<IPermissionRole> = new EventEmitter<IPermissionRole>();

  columns: Array<TableColumn> = [
    { name: 'ID доступа', prop: 'id', minWidth: 70, maxWidth: 100 },
    { name: 'Название', prop: 'name', minWidth: 200, maxWidth: 350 },
    this.columnDecoratorService.decorateColumn(
      {name: 'Значение', prop: 'value', minWidth: 70, maxWidth: 100},
      (row: IPermissionModel) => this.toBooleanColumnValue(row)
    ),
    { name: 'Описание', prop: 'dsc', minWidth: 200 },
    { name: 'Альт. коментарий', prop: 'altDsc', minWidth: 200 },
    { name: 'Комментарий', prop: 'comment' },
  ];

  bottomActions: Array<IToolbarAction> = [
    { text: 'Добавить', type: ToolbarActionTypeEnum.ADD, visible: false, permission: 'PERMIT_ADD' },
    { text: 'Изменить', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'PERMIT_EDIT' },
    { text: 'Копировать', type: ToolbarActionTypeEnum.CLONE, visible: false, permission: 'PERMIT_ADD' },
    { text: 'Удалить', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'PERMIT_DELETE' },
  ];

  bottomPermitActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  bottomRoleActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.CLONE,
    ToolbarActionTypeEnum.ADD,
  ];

  tabs: Array<any> = [
    {id: 0, title: 'Доступы', active: true},
  ];

  constructor(private permissionsService: PermissionsService,
              private columnDecoratorService: GridColumnDecoratorService) {
    super({
      read: '/api/roles/{id}/permits',
      dataKey: 'permits',
    }, datePipe);
  }

  /**
   * @override
   */
  public ngAfterViewInit() {
    this.refreshGrid();
  }

  /**
   * @override
   */
  public ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    this.refreshGrid();
  }

  private onAction(action: IToolbarAction) {
    this.displayProperties.editPermit = false;
    this.displayProperties.addPermit = false;
    this.displayProperties.removePermit = false;

    switch (action.type) {
      case ToolbarActionTypeEnum.EDIT:
        this.displayProperties.editPermit = true;
        break;
      case ToolbarActionTypeEnum.ADD:
        this.displayProperties.addPermit = true;
        break;
      case ToolbarActionTypeEnum.REMOVE:
        this.displayProperties.removePermit = true;
        break;
      case ToolbarActionTypeEnum.CLONE:
        this.cloneRole.emit(this.currentRole);
        break;
    }
  }

  onBeginEditPermission() {
    this.displayProperties.editPermit = true;
  }

  onSelectPermissions(records: IPermissionModel[]) {
    if (records.length) {
      this.editedPermission = records[0];
    }
    this.refreshToolbar(records);
  }

  onEditPermission(permission: IPermissionModel) {
    const permissionId: number = this.editedPermission.id;

    this.permissionsService.editPermission(this.currentRole, permissionId, permission)
      .then(() => {
        this.displayProperties.editPermit = false;
        Object.assign(this.permitsGrid.findRowById(permissionId), this.toRawValue(permission));
      });
  }

  onAddPermissions(addedPermissions: IPermissionModel[]) {
    const permissionsIds: number [] = addedPermissions.map((rec: IPermissionModel) => rec.id);

    this.permissionsService.addPermission(this.currentRole, permissionsIds)
      .then(() => {
        this.displayProperties.addPermit = false;
        this.refreshGrid();
      });
  }

  onRemovePermission() {
    const permissionId: number = this.editedPermission.id;
    this.permissionsService.removePermission(this.currentRole, {
      permitIds: [permissionId]
    }).then(() => {
      this.displayProperties.removePermit = false;
      this.permitsGrid.removeRowById(permissionId);
    });
  }

  private loadGrid(): Promise<any> {
    return this.permitsGrid.load(this.currentRole).then(() => this.refreshToolbar());
  }

  private refreshGrid() {
    if (!this.permitsGrid) {
      return;
    }

    if (this.currentRole) {
      this.loadGrid();
    } else {
      this.permitsGrid.clear();
    }
  }

  private refreshToolbar(permissions: IPermissionModel[] = []) {
    const isRoleSelected: boolean = !!this.currentRole;
    const isRolePermissionSelected: boolean = permissions.length > 0;

    this.setActionsVisibility(this.bottomRoleActionsGroup, isRoleSelected);
    this.setActionsVisibility(this.bottomPermitActionsGroup, isRolePermissionSelected);
  }

  private setActionsVisibility(actionTypesGroup: Array<ToolbarActionTypeEnum>, visible: boolean) {
    actionTypesGroup.forEach((actionType: ToolbarActionTypeEnum) => {
      this.bottomActions.find((action: IToolbarAction) => actionType === action.type).visible = visible;
    });
  }
}
