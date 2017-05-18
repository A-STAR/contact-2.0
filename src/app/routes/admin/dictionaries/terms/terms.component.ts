import { Component, Input } from '@angular/core';

import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';

import { ITerm } from './terms.interface';
import { IDict } from '../dict/dict.interface';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent extends GridEntityComponent<ITerm> {

  @Input() currentMaster: IDict;

  bottomActions: Array<IToolbarAction> = [
    { text: 'Добавить', type: ToolbarActionTypeEnum.ADD, visible: true },
    { text: 'Изменить', type: ToolbarActionTypeEnum.EDIT, visible: false },
    { text: 'Удалить', type: ToolbarActionTypeEnum.REMOVE, visible: false },
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<any> = [
    { name: 'ID', prop: 'id', minWidth: 30, maxWidth: 70 },
    { name: 'Название', prop: 'name', maxWidth: 400 },
    { name: 'Системный', prop: 'system' },
    { name: 'Язык', prop: 'language' },
  ];

  dataSource: IDataSource = {
    read: '/api/terms',
    update: '/api/terms',
    dataKey: 'terms',
  };

  constructor() {
    super();
  }

  public createEmptyEntity(): ITerm {
    return {
      id: null,
      name: '',
      system: 0
    };
  }
}
