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
    { text: 'Добавить', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'DICT_ADD' },
    { text: 'Изменить', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'DICT_EDIT' },
    { text: 'Удалить', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'DICT_DELETE' },
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<any> = [
    { name: 'ID', prop: 'id', minWidth: 30, maxWidth: 70 },
    { name: 'Название', prop: 'name', maxWidth: 400 },
    { name: 'Комментарий', prop: 'comment', width: 200 },
    { name: 'Системный', prop: 'system'},
  ];

  dataSource: IDataSource = {
    read: '/api/dict',
    update: '/api/dict',
    dataKey: 'dict',
  };

  constructor(private dictService: DictService) {
    super();
  }

  onEditSubmit(data: any): void {
    if (this.selectedEntity) {
      this.dictService.editDict(this.selectedEntity, data).subscribe(() => {
        this.action = null;
      });
    } else {
      this.dictService.createDict(data).subscribe(() => {
        this.action = null;
      });
    }
  }

  onRemoveSubmit(): void {
    this.dictService.removeDict(this.selectedEntity).subscribe(() => {
      this.action = null;
    });
  }

  onCancel(): void {
    this.action = null;
  }
}
