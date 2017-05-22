import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ValueConverterService } from '../../../core/converter/value/value-converter.service';
import { IDataSource } from '../../../shared/components/grid/grid.interface';
import { GridColumnDecoratorService } from '../../../shared/components/grid/grid.column.decorator.service';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../shared/components/entity/grid.entity.component';
import { GridService } from '../../../shared/components/grid/grid.service';
import { IConstant } from './constants.interface';

@Component({
  selector: 'app-constants',
  templateUrl: './constants.component.html'
})
export class ConstantsComponent extends GridEntityComponent<IConstant> {
  bottomActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'CONST_VALUE_EDIT' },
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
  ];

  columns: Array<any> = [
    { name: 'Ид', prop: 'id', minWidth: 30, maxWidth: 70, disabled: true },
    { name: 'Название константы', prop: 'name', maxWidth: 350 },
    this.columnDecoratorService.decorateColumn(
      {name: 'Значение', prop: 'value', minWidth: 70, maxWidth: 150},
      (constant) => this.valueConverterService.deserializeBooleanViewValue(constant)
    ),
    { name: 'Комментарий', prop: 'dsc', width: 200, minWidth: 400 },
  ];

  dataSource: IDataSource = {
    read: '/api/constants',
    update: '/api/constants/{id}',
    dataKey: 'constants',
  };

  tabs: Array<any> = [
    { id: 0, title: 'Константы', active: true },
  ];

  constructor(
    private datePipe: DatePipe,
    private gridService: GridService,
    private columnDecoratorService: GridColumnDecoratorService,
    private valueConverterService: ValueConverterService) {

    super();
  }

  onTabClose(id: number): void {
    this.tabs = this.tabs.filter((tab, tabId) => tabId !== id);
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
        // TODO: display error
        error => console.error(error)
      );
  }

  valueToIsoDate(value: any): string {
    // TODO: move to date service
    const converted = value.split('.').reverse().map(Number);
    return this.datePipe.transform(new Date(converted), 'yyyy-MM-ddTHH:mm:ss') + 'Z';
  }
}
