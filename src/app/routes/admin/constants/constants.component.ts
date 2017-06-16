import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/distinctUntilChanged';

import { IConstant } from '../../../core/constants/constants.interface';
import { IDataSource, IGridColumn } from '../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../shared/components/toolbar-2/toolbar-2.interface';

import { ConstantsService } from '../../../core/constants/constants.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { PermissionsService } from '../../../core/permissions/permissions.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

import { GridComponent } from '../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-constants',
  templateUrl: './constants.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstantsComponent implements AfterViewInit, OnDestroy {
  static COMPONENT_NAME = 'ConstantsComponent';

  @ViewChild(GridComponent) grid: GridComponent;

  display = false;
  selectedRecord: IConstant = null;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.display = true,
      enabled: Observable.combineLatest(
        this.permissionService.hasPermission('CONST_VALUE_EDIT'),
        // TODO(d.maltsev): constants store
        Observable.of(!!this.selectedRecord)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.refreshGrid(),
      enabled: this.permissionService.hasPermission('CONST_VALUE_VIEW')
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 30, maxWidth: 70, disabled: true },
    { prop: 'name', maxWidth: 350 },
    { prop: 'value', minWidth: 70, maxWidth: 150, localized: true },
    { prop: 'dsc', width: 200, minWidth: 400 },
  ];

  renderers = {
    value: (constant: any) => this.valueConverterService.deserializeBoolean(constant),
  };

  dataSource: IDataSource = {
    read: '/api/constants',
    update: '/api/constants/{id}',
    dataKey: 'constants',
  };

  permissionSub: Subscription;
  rows: IConstant[];

  constructor(
    private gridService: GridService,
    private constantsService: ConstantsService,
    private notificationsService: NotificationsService,
    private valueConverterService: ValueConverterService,
    private permissionService: PermissionsService,
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  ngAfterViewInit(): void {
    const permission = 'CONST_VALUE_VIEW';

    this.permissionSub = this.permissionService.hasPermission(permission)
      .distinctUntilChanged()
      .subscribe(hasPermission => {
        if (!hasPermission) {
          this.selectedRecord = null;
          this.notificationsService.error({ message: 'roles.permissions.messages.no_view', param: { permission } });
          this.grid.clear();
        } else {
          this.refreshGrid();
        }
      });
  }

  ngOnDestroy(): void {
    this.permissionSub.unsubscribe();
  }

  parseFn = (data) => this.valueConverterService.deserializeSet(data.constants) as Array<IConstant>;

  onSubmit(constant: IConstant): void {
    // TODO: move the logic to constants service
    const { id, typeCode, value } = constant;
    const fieldMap: object = {
      1: 'valueN',
      2: 'valueD',
      3: 'valueS',
      4: 'valueB',
    };
    const field: string = fieldMap[typeCode];
    const body = { [field]: value };

    if (typeCode === 4) {
      // convert the boolean to a number
      body[field] = Number(value);
    } else if (typeCode === 2) {
      // convert the date back to ISO8601
      body[field] = this.valueConverterService.valueToIsoDate(value);
    }

    this.gridService
      .update(this.dataSource.update, { id }, body)
      .take(1)
      .subscribe(
        () => {
          this.refreshGrid();
          this.onCancel();
        },
        error => this.notificationsService.error('constants.api.errors.update')
      );
  }

  onBeforeEdit(): void {
    this.display = true;
  }

  onCancel(): void {
    this.display = false;
  }

  onSelectRecord(records: Array<IConstant>): void {
    this.selectedRecord = records[0];
    this.constantsService.changeSelected(this.selectedRecord);
  }

  private refreshGrid(): void {
    if (!this.grid) {
      return;
    }

    this.grid.load()
      .take(1)
      .subscribe(() => {
        // to refresh the toolbar
        this.selectedRecord = null;
        this.constantsService.changeSelected(null);
      });
  }

}
