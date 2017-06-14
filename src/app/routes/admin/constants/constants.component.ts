import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Observable,  } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAppState } from '../../../core/state/state.interface';
import { IConstant } from './constants.interface';
import { IDataSource, IGridColumn } from '../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../shared/components/toolbar/toolbar.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';
import { PermissionsService } from '../../../core/permissions/permissions.service';

import { GridEntityComponent } from '../../../shared/components/entity/grid.entity.component';

@Component({
  selector: 'app-constants',
  templateUrl: './constants.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstantsComponent extends GridEntityComponent<IConstant> implements AfterViewInit, OnDestroy {
  static COMPONENT_NAME = 'ConstantsComponent';

  toolbarActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'CONST_VALUE_EDIT' },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
  ];

  toolbarActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
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
  // rows: Observable<IConstant[]>;

  constructor(
    private store: Store<IAppState>,
    private datePipe: DatePipe,
    private gridService: GridService,
    private translateService: TranslateService,
    private notifications: NotificationsService,
    private valueConverterService: ValueConverterService,
    private permissionService: PermissionsService,
  ) {
    super();
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  ngAfterViewInit(): void {
    const permission = 'CONST_VALUE_VIEW';

    this.permissionSub = this.permissionService.hasPermission(permission)
      .distinctUntilChanged()
      .subscribe(hasPermission => {
        if (!hasPermission) {
          this.notifications.error({ message: 'roles.permissions.messages.no_view', param: { permission } });
          this.grid.clear();
        } else {
          this.grid.load()
            .take(1)
            .subscribe();
        }
      });
  }

  ngOnDestroy(): void {
    this.permissionSub.unsubscribe();
  }

  parseFn = (data) => this.valueConverterService.deserializeSet(data.constants) as Array<IConstant>;

  onEditSubmit(data: any): void {
    // TODO: move logic to constants service
    const id = data.id;
    const typeCode = data.typeCode;
    const value = data.value;
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
      body[field] = this.valueToIsoDate(value);
    }

    this.gridService
      .update(this.dataSource.update, { id }, body)
      .take(1)
      .subscribe(
        () => {
          this.afterUpdate();
          this.cancelAction();
        },
        error => this.notifications.error('Could not save the changes')
      );
  }

  valueToIsoDate(value: any): string {
    // TODO: move to date service
    const converted = value.split('.').reverse().map(Number);
    return this.datePipe.transform(new Date(converted), 'yyyy-MM-ddTHH:mm:ss') + 'Z';
  }

  // private handleError(error: XMLHttpRequest, action?: string): void {
  //   const { status } = error;
  //   switch (status) {
  //     case 401:
  //       this.notifications.error(`Authentication error. Please try to relogin.`);
  //       break;
  //     case 403:
  //       this.notifications.error(`Insufficient user permissions for '${action}' action`);
  //       break;
  //     default:
  //   }
  // }
}
