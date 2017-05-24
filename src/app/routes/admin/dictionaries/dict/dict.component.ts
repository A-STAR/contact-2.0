import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';
import { IDict } from './dict.interface';
import { DictService } from 'app/routes/admin/dictionaries/dict/dict.service';
import { GridColumnDecoratorService } from '../../../../shared/components/grid/grid.column.decorator.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-dict',
  templateUrl: './dict.component.html'
})
export class DictComponent extends GridEntityComponent<IDict> {

  bottomActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'DICT_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'DICT_EDIT' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'DICT_DELETE' },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<any> = [
    { prop: 'code', minWidth: 100, maxWidth: 150 },
    { prop: 'name', maxWidth: 300 },
    { prop: 'parentCode', width: 200 },
    this.columnDecoratorService.decorateColumn({ prop: 'typeCode', localized: true },
      // TODO Duplication
      Observable.of([
        { label: 'dictionaries.types.system', value: 1 },
        { label: 'dictionaries.types.client', value: 2 }
      ])
    )
  ];

  dataSource: IDataSource = {
    read: '/api/dictionaries',
    dataKey: 'dictNames',
  };

  constructor(private dictService: DictService,
              private gridService: GridService,
              private valueConverterService: ValueConverterService,
              private columnDecoratorService: GridColumnDecoratorService) {
    super();
  }

  onEditSubmit(data: IDict, editMode: boolean): void {
    data.typeCode = this.valueConverterService.firstLabeledValue(data.typeCode as Array<ILabeledValue>);
    data.parentCode = this.valueConverterService.firstLabeledValue(data.parentCode as Array<ILabeledValue>);

    if (editMode) {
      this.dictService.editDict(this.selectedEntity, data).subscribe(() => this.onSuccess());
    } else {
      this.gridService.create('/api/dictionaries', {}, data)
        .subscribe(() => this.onSuccess());
    }
  }

  onUpdateEntity(data: IDict): void {
    this.onEditSubmit(data, true);
  }

  onCreateEntity(data: IDict): void {
    this.onEditSubmit(data, false);
  }

  onRemoveSubmit(): void {
    this.dictService.removeDict(this.selectedEntity).subscribe(() => this.onSuccess());
  }

  onSuccess(): void {
    this.cancelAction();
    this.afterUpdate();
  }
}
