import { Component, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

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
  templateUrl: './constants.component.html'
})
export class ConstantsComponent extends GridEntityComponent<IConstant> implements AfterViewInit {
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
    value: (constant: any) => this.valueConverterService.deserializeBooleanViewValue(constant),
  };

  dataSource: IDataSource = {
    read: '/api/constants',
    update: '/api/constants/{id}',
    dataKey: 'constants',
  };

  constructor(
    private datePipe: DatePipe,
    private gridService: GridService,
    private translateService: TranslateService,
    private notifications: NotificationsService,
    private valueConverterService: ValueConverterService,
    private permissions: PermissionsService,
) {
    super();
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  ngAfterViewInit(): void {
    this.grid.load()
      .subscribe(
        () => console.log(true),
        (error) => console.log(error)
      );
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
      .update('/api/constants/{id}', { id }, body)
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
}
