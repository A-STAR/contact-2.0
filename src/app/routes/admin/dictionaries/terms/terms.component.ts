import { Component } from '@angular/core';

import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';

import { ITerm } from './terms.interface';
import { GridService } from '../../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent extends GridEntityComponent<ITerm> {

  bottomActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'DICT_TERM_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'DICT_TERM_EDIT' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'DICT_TERM_DELETE' },
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<any> = [
    { prop: 'code', minWidth: 30, maxWidth: 70 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'typeCode' },
    { prop: 'parentCodeName' },
    { prop: 'isClosed' },
  ];

  dataSource: IDataSource = {
    read: '/api/dictionaries/{code}/terms',
    dataKey: 'terms',
  };

  constructor(private gridService: GridService) {
    super();
  }

  onEditSubmit(data: ITerm, createMode: boolean): void {
    if (Array.isArray(data.typeCode)) {
      data.typeCode = data.typeCode[0].value;
    }
    if (createMode) {
      this.gridService.create('/api/dictionaries/{code}/terms', this.masterEntity, data)
        .subscribe(() => this.onSuccess());
    } else {
      this.gridService.update('/api/dictionaries/{code}/terms/{termsId}', this.masterEntity, data)
        .subscribe(() => this.onSuccess());
    }
  }

  onRemoveSubmit(): void {
    const termsId: number = this.selectedEntity.id;
    this.gridService.delete(`/api/dictionaries/{code}/terms/${termsId}`, this.masterEntity)
      .subscribe(() => this.onSuccess());
  }

  onSuccess(): void {
    this.cancelAction();
    this.afterUpdate();
  }
}
