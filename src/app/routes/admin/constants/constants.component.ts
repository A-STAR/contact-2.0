import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';

import { IConstant } from './constants.interface';
import { IDataSource, IGridColumn } from '../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../shared/components/toolbar-2/toolbar-2.interface';

import { ConstantsService } from './constants.service';
import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UserConstantsService } from '../../../core/user/constants/user-constants.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

import { GridComponent } from '../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-constants',
  templateUrl: './constants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstantsComponent implements AfterViewInit, OnDestroy {
  static COMPONENT_NAME = 'ConstantsComponent';

  @ViewChild(GridComponent) grid: GridComponent;

  display = false;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.display = true,
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('CONST_VALUE_EDIT'),
        this.constantsService.state.map(state => !!state.currentConstant)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.constantsService.fetch(),
      enabled: this.userPermissionsService.has('CONST_VALUE_VIEW')
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 30, maxWidth: 70, disabled: true },
    { prop: 'name', minWidth: 150, maxWidth: 350 },
    { prop: 'value', minWidth: 100, maxWidth: 150, localized: true },
    { prop: 'dsc', minWidth: 200 },
  ];

  renderers = {
    value: (constant: any) => this.valueConverterService.deserializeBoolean(constant),
  };

  dataSource: IDataSource = {
    read: '/constants',
    update: '/constants/{id}',
    dataKey: 'constants',
  };

  permissionSub: Subscription;

  rows$: Observable<Array<IConstant>>;

  selectedRecord$: Observable<IConstant>;

  hasViewPermission$: Observable<boolean>;

  emptyMessage$: Observable<string>;

  constructor(
    private constantsService: ConstantsService,
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    this.rows$ = this.constantsService.state.map(state => this.valueConverterService.deserializeSet(state.constants));
    this.selectedRecord$ = this.constantsService.state.map(state => state.currentConstant);
  }

  ngAfterViewInit(): void {
    this.hasViewPermission$ = this.userPermissionsService.has('CONST_VALUE_VIEW');

    this.permissionSub = this.hasViewPermission$
      .filter(hasPermission => hasPermission !== undefined)
      .subscribe(hasPermission => {
        if (!hasPermission) {
          this.constantsService.clear();
          this.notificationsService.error('errors.default.read.403').entity('entities.constants.gen.plural').dispatch();
        } else {
          this.constantsService.fetch();
        }
      });

    this.emptyMessage$ = this.hasViewPermission$.map(hasPermission => hasPermission ? null : 'constants.errors.view');
  }

  ngOnDestroy(): void {
    this.permissionSub.unsubscribe();
  }

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
    }

    this.dataService
      .update(this.dataSource.update, { id }, body)
      .take(1)
      .subscribe(
        () => {
          this.constantsService.fetch();
          this.userConstantsService.refresh();
          this.onCancel();
        },
        error => this.notificationsService.error('constants.api.errors.update').dispatch()
      );
  }

  onBeforeEdit(): void {
    const permission = 'CONST_VALUE_EDIT';
    this.userPermissionsService.has('CONST_VALUE_EDIT')
      .take(1)
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.display = true;
        } else {
          this.notificationsService.error('roles.permissions.messages.no_edit').params({ permission }).dispatch();
        }
      });
  }

  onCancel(): void {
    this.display = false;
  }

  onSelect(record: IConstant): void {
    this.constantsService.changeSelected(record);
  }
}
