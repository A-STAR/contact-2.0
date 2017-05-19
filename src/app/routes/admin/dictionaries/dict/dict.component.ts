import { Component } from '@angular/core';
import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';
import { IDict } from './dict.interface';
import { DictService } from 'app/routes/admin/dictionaries/dict/dict.service';

@Component({
  selector: 'app-dict',
  templateUrl: './dict.component.html'
})
export class DictComponent extends GridEntityComponent<IDict> {

  bottomActions: Array<IToolbarAction> = [
    { text: 'TOOLBAR.ACTION.ADD', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'DICT_ADD' },
    { text: 'TOOLBAR.ACTION.EDIT', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'DICT_EDIT' },
    { text: 'TOOLBAR.ACTION.REMOVE', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'DICT_DELETE' },
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<any> = [
    { name: 'ID', prop: 'id', minWidth: 30, maxWidth: 70 },
    { name: 'Код словаря', prop: 'code', minWidth: 30, maxWidth: 70 },
    { name: 'Название', prop: 'name', maxWidth: 300 },
    { name: 'Родительский словарь', prop: 'parentCode', width: 200 },
    { name: 'Тип словаря', prop: 'typeCode'},
  ];

  dataSource: IDataSource = {
    read: '/api/dictionaries',
    dataKey: 'dict',
  };

  constructor(private dictService: DictService) {
    super();
  }

  onEditSubmit(data: any, createMode: boolean): void {
    if (createMode) {
      this.dictService.createDict(data).subscribe(() => this.cancelAction());
    } else {
      this.dictService.editDict(this.selectedEntity, data).subscribe(() => this.cancelAction());
    }
  }

  onRemoveSubmit(): void {
    this.dictService.removeDict(this.selectedEntity).subscribe(() => this.cancelAction());
  }
}
