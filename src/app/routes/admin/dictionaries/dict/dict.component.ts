import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';
import { IDict } from './dict.interface';
import { DictService } from 'app/routes/admin/dictionaries/dict/dict.service';
import { GridColumnDecoratorService } from '../../../../shared/components/grid/grid.column.decorator.service';

@Component({
  selector: 'app-dict',
  templateUrl: './dict.component.html'
})
export class DictComponent extends GridEntityComponent<IDict> {

  bottomActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'DICT_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'DICT_EDIT' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'DICT_DELETE' },
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<any> = [
    { prop: 'code', minWidth: 100, maxWidth: 150 },
    { prop: 'name', maxWidth: 300 },
    { prop: 'parentCode', width: 200 },
    this.columnDecoratorService.decorateRelatedEntityColumn({ prop: 'typeCode' },
      // TODO Duplication
      Observable.of([
        { label: 'dictionaries.types.system', value: 1 },
        { label: 'dictionaries.types.client', value: 2 }
      ]),
      true
    )
  ];

  dataSource: IDataSource = {
    read: '/api/dictionaries',
    dataKey: 'dictNames',
  };

  constructor(private dictService: DictService,
              private columnDecoratorService: GridColumnDecoratorService) {
    super();
  }

  onEditSubmit(data: any, createMode: boolean): void {
    if (createMode) {
      this.dictService.createDict(data).subscribe(() => this.onSuccess());
    } else {
      this.dictService.editDict(this.selectedEntity, data).subscribe(() => this.onSuccess());
    }
  }

  onRemoveSubmit(): void {
    this.dictService.removeDict(this.selectedEntity).subscribe(() => this.onSuccess());
  }

  onSuccess(): void {
    this.cancelAction();
    this.afterUpdate();
  }
}
