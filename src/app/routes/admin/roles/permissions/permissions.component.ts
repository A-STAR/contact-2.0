import {
  Component, Input, OnChanges, SimpleChange, ViewChild, AfterViewInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../../core/state/state.interface';
import { IDataSource, IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IPermissionsDisplayEnum } from '../../../../core/permissions/permissions.interface';
import { IPermissionModel, IPermissionRole, IPermissionsResponse } from './permissions.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { PermissionsService } from './permissions.service';
import { PermissionsService as PermService } from '../../../../core/permissions/permissions.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

import { GridComponent } from '../../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent implements AfterViewInit, OnChanges {

  display: Observable<IPermissionsDisplayEnum>;
  private editedPermission: IPermissionModel;

  @ViewChild(GridComponent) permitsGrid: GridComponent;
  @Input() currentRole: IPermissionRole;

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 70, maxWidth: 100 },
    { prop: 'name', minWidth: 200, maxWidth: 350 },
    { prop: 'value', minWidth: 70, maxWidth: 100, localized: true },
    { prop: 'dsc', minWidth: 200 },
    { prop: 'comment', minWidth: 300 },
  ];

  renderers: IRenderer = {
    value: (permission: IPermissionModel) => this.valueConverterService.deserializeBooleanViewValue(permission)
  };

  toolbarActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: false, permission: 'PERMIT_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'PERMIT_EDIT' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'PERMIT_DELETE' },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
  ];

  permitActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  roleActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.ADD,
    ToolbarActionTypeEnum.REFRESH,
  ];

  dataSource: IDataSource = {
    read: '/api/roles/{id}/permits',
    dataKey: 'permits'
  };

  shouldDisplay(action: number): Observable<boolean> {
    return this.display.map(display => display === action);
  }

  constructor(
    private store: Store<IAppState>,
    private permissionsService: PermissionsService,
    private permService: PermService,
    private gridService: GridService,
    private valueConverterService: ValueConverterService
  ) {
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      this.display = this.store.select(state => state.permissions.display);
  }

  parseFn = (data: IPermissionsResponse) => this.valueConverterService.deserializeSet(data.permits);

  ngAfterViewInit(): void {
    this.permitsGrid.onRowsChange.subscribe(() => {
      this.editedPermission = null;
      this.refreshToolbar();
    });
    this.refreshGrid();
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}): void {
    this.refreshGrid();
  }

  onAction(action: IToolbarAction): void {
    switch (action.type) {
      case ToolbarActionTypeEnum.REFRESH:
        this.loadGrid();
        break;
      case ToolbarActionTypeEnum.EDIT:
        this.permService.permissionDisplay(
          { display: IPermissionsDisplayEnum.EDIT, editedPermission: this.editedPermission }
        );
        break;
      case ToolbarActionTypeEnum.ADD:
        this.permService.permissionDisplay(
          { display: IPermissionsDisplayEnum.ADD, editedPermission: this.editedPermission }
        );
        break;
      case ToolbarActionTypeEnum.REMOVE:
        this.permService.permissionDisplay(
          { display: IPermissionsDisplayEnum.DELETE, editedPermission: this.editedPermission }
        );
        break;
    }
  }

  onBeforeEditPermission(): void {
    if (!this.editedPermission) {
      return;
    }

    this.permService.permissionDisplay(
      { display: IPermissionsDisplayEnum.EDIT, editedPermission: this.editedPermission }
    );
  }

  onSelectPermissions(records: IPermissionModel[]): void {
    if (records.length) {
      this.editedPermission = records[0];
    }
    this.refreshToolbar();
  }

  onAfterEditPermission(permission: IPermissionModel): void {
    const permissionId: number = this.editedPermission.id;
    this.permissionsService.editPermission(this.currentRole, permissionId, permission)
      .subscribe(
        () => {
          this.onCancel();
          this.refreshGrid();
        },
        // TODO: display & log a message
        err => console.error(err)
      );
  }

  onCancel(): void {
    this.permService.permissionDisplay(
      { display: IPermissionsDisplayEnum.NONE, editedPermission: null }
    );
  }

  onAddPermissions(addedPermissions: IPermissionModel[]): void {
    const permissionsIds: number[] = addedPermissions.map((rec: IPermissionModel) => rec.id);
    this.permService.addPermission(this.currentRole, permissionsIds);
  }

  onRemovePermission(): void {
    const permissionId: number = this.editedPermission.id;
    this.permissionsService.removePermission(this.currentRole, permissionId)
      .subscribe(
        () => {
          // this.displayProperties.removePermit = false;
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
    this.setActionsVisibility(this.roleActionsGroup, !!this.currentRole);
    this.setActionsVisibility(this.permitActionsGroup, !!this.editedPermission);
    console.log('current role', this.currentRole);
    console.log('edited permission', !!this.editedPermission);
  }

  private setActionsVisibility(actionTypesGroup: Array<ToolbarActionTypeEnum>, visible: boolean): void {
    actionTypesGroup.forEach((actionType: ToolbarActionTypeEnum) => {
      // console.log(actionType, visible);
      this.toolbarActions.find((action: IToolbarAction) => actionType === action.type).visible = visible;
    });
  }
}
