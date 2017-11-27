import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';

import { IConstant } from './constants.interface';
import { IGridColumn } from '../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../shared/components/toolbar-2/toolbar-2.interface';

import { ConstantsService } from './constants.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UserConstantsService } from '../../../core/user/constants/user-constants.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../core/converter/value-converter.service';

import { GridComponent } from '../../../shared/components/grid/grid.component';

import { combineLatestAnd } from '../../../core/utils/helpers';
import { DialogFunctions } from '../../../core/dialog';

@Component({
  selector: 'app-constants',
  templateUrl: './constants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstantsComponent extends DialogFunctions implements AfterViewInit, OnDestroy, OnInit {
  static COMPONENT_NAME = 'ConstantsComponent';

  @ViewChild(GridComponent) grid: GridComponent;

  dialog = null;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.setDialog('editConstant'),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('CONST_VALUE_EDIT'),
        this.constantsService.state.map(state => !!state.currentConstant)
    ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchAll(),
      enabled: this.userPermissionsService.has('CONST_VALUE_VIEW')
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 30, maxWidth: 70, disabled: true },
    { prop: 'name', minWidth: 150, maxWidth: 350 },
    { prop: 'value', minWidth: 100, maxWidth: 150,
      renderer: (constant: IConstant) => this.valueConverterService.deserializeBoolean(constant)
    },
    { prop: 'dsc', minWidth: 200 },
  ];

  emptyMessage$: Observable<string>;
  hasViewPermission$: Observable<boolean>;
  permissionSub: Subscription;
  selectedRecord$: Observable<IConstant>;

  rows: IConstant[];
  selection: IConstant[];

  constructor(
    private constantsService: ConstantsService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private cdRef: ChangeDetectorRef,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.columns = this.gridService.setRenderers(this.columns);
    this.selectedRecord$ = this.constantsService.state.map(state => state.currentConstant);
  }

  ngAfterViewInit(): void {
    this.hasViewPermission$ = this.userPermissionsService.has('CONST_VALUE_VIEW');

    this.permissionSub = this.hasViewPermission$
      .subscribe(hasPermission => {
        if (!hasPermission) {
          this.clear();
          this.notificationsService.error('errors.default.read.403').entity('entities.constants.gen.plural').dispatch();
        } else {
          this.fetchAll();
        }
      });

    this.emptyMessage$ = this.hasViewPermission$.map(hasPermission => hasPermission ? null : 'constants.errors.view');
  }

  fetchAll(): void {
    this.constantsService.fetchAll()
      .map(constants => this.valueConverterService.deserializeSet(constants))
      .flatMap((constants: IConstant[]) => {
        this.rows = constants;
        return this.constantsService.state
          .map(state => state.currentConstant);
      })
      .pipe(first())
      .subscribe(currentConstant => {
        if (currentConstant) {
          const found = this.rows.find(row => row.id === currentConstant.id);
          this.selection = found ? [found] : [];
          if (!found) {
            this.constantsService.changeSelected(null);
          }
        } else {
          this.selection = [];
        }

        this.cdRef.markForCheck();
      });
  }

  clear(): void {
    this.rows = [];
  }

  ngOnDestroy(): void {
    this.permissionSub.unsubscribe();
  }

  onSubmit(constant: IConstant): void {
    const body = this.constantsService.serialize(constant);
    this.constantsService.update(body)
      .subscribe(() => {
        this.fetchAll();
        this.userConstantsService.refresh();
        this.onCloseDialog();
      });
  }

  onDblClick(): void {
    const permission = 'CONST_VALUE_EDIT';
    this.userPermissionsService.has(permission)
      .pipe(first())
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.setDialog('editConstant');
        } else {
          this.notificationsService.error('roles.permissions.messages.no_edit').params({ permission }).dispatch();
        }
      });
  }

  onSelect(record: IConstant): void {
    this.selection = [record];
    this.constantsService.changeSelected(record);
  }
}
