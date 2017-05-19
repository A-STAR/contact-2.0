import { Component } from '@angular/core';

import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';

import { ITerm } from './terms.interface';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent extends GridEntityComponent<ITerm> {

  bottomActions: Array<IToolbarAction> = [
    { text: 'TOOLBAR.ACTION.ADD', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'DICT_TERM_ADD' },
    { text: 'TOOLBAR.ACTION.EDIT', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'DICT_TERM_EDIT' },
    { text: 'TOOLBAR.ACTION.REMOVE', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'DICT_TERM_DELETE' },
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
    read: '/api/{id}/terms',
    update: '/api/terms',
    dataKey: 'terms',
  };

  constructor() {
    super();
  }
}
