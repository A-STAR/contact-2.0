import {
  Component,
  AfterViewInit,
  // ChangeDetectionStrategy,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '../../../../core/state/state.interface';
import { IDataSource, IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IPermissionsDialogEnum } from '../../../../core/permissions/permissions.interface';
import { IPermissionModel, IPermissionRole, IPermissionsResponse } from './permissions.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { PermissionsService } from '../../../../core/permissions/permissions.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

import { GridComponent } from '../../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsComponent implements AfterViewInit, OnChanges, OnDestroy {

  dialog: Observable<IPermissionsDialogEnum>;
  private currentPermission: IPermissionModel;
  private gridRowChangeSub: Subscription;

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
    value: (permission: IPermissionModel) => this.valueConverterService.deserializeBoolean(permission)
  };

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      permissions: [ 'PERMIT_ADD' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.ADD),
      disabled: (state: IAppState) => !this.currentRole,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      permissions: [ 'PERMIT_EDIT' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.EDIT),
      disabled: (state: IAppState) => !state.permissions.currentPermission,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      permissions: [ 'PERMIT_DELETE' ],
      action: () => this.dialogAction(IPermissionsDialogEnum.DELETE),
      disabled: (state: IAppState) => !state.permissions.currentPermission,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      permissions: [ 'PERMIT_VIEW' ],
      action: () => this.refreshGrid(),
    },
  ];

  dataSource: IDataSource = {
    read: '/api/roles/{id}/permits',
    dataKey: 'permits'
  };

  isDialog(action: number): Observable<boolean> {
    return this.dialog.map(dialog => dialog === action);
  }

  constructor(
    private store: Store<IAppState>,
    private permissionsService: PermissionsService,
    private gridService: GridService,
    private valueConverterService: ValueConverterService
  ) {
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      this.dialog = this.store.select(state => state.permissions.dialog);
  }

  parseFn = (data: IPermissionsResponse) => this.valueConverterService.deserializeSet(data.permits);

  ngAfterViewInit(): void {
    this.gridRowChangeSub = this.permitsGrid.onRowsChange.subscribe(() => {
      this.currentPermission = null;
      // TODO(a.tymchuk): replace with this.changeCurrentRecord
      this.dialogAction(IPermissionsDialogEnum.NONE);
    });
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}): void {
    this.refreshGrid();
  }

  ngOnDestroy(): void {
    this.gridRowChangeSub.unsubscribe();
  }

  onBeforeEditPermission(): void {
    if (!this.currentPermission) {
      return;
    }

    this.permissionsService.permissionDialodAction(
      { dialog: IPermissionsDialogEnum.EDIT, currentPermission: this.currentPermission }
    );
  }

  onSelectPermissions(records: IPermissionModel[]): void {
    if (records.length) {
      this.currentPermission = records[0];
      this.permissionsService.permissionDialodAction(
        { dialog: IPermissionsDialogEnum.NONE, currentPermission: this.currentPermission }
      );
    }
  }

  onAfterEditPermission(permission: IPermissionModel): void {
    this.permissionsService.updatePermission(
      this.currentRole.id,
      this.currentPermission.id,
      this.valueConverterService.serialize(permission)
    );
  }

  onCancel(): void {
    this.permissionsService.permissionDialodAction(
      { dialog: IPermissionsDialogEnum.NONE, currentPermission: this.currentPermission }
    );
  }

  onAddPermissions(addedPermissions: IPermissionModel[]): void {
    const permissionsIds: number[] = addedPermissions.map((rec: IPermissionModel) => rec.id);
    this.permissionsService.addPermission(this.currentRole, permissionsIds);
  }

  onRemovePermission(): void {
    const permissionId: number = this.currentPermission.id;
    this.permissionsService.removePermission(this.currentRole, permissionId);
  }

  private loadGrid(): void {
    this.permitsGrid.load(this.currentRole)
      .take(1)
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

  private dialogAction(dialog: IPermissionsDialogEnum): void {
    this.permissionsService.permissionDialodAction(
      { dialog, currentPermission: this.currentPermission }
    );
  }

}
