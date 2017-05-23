import { Component } from '@angular/core';

import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';

import { ITerm } from './terms.interface';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { GridColumnDecoratorService } from '../../../../shared/components/grid/grid.column.decorator.service';

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
    { prop: 'code', minWidth: 100, maxWidth: 150 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'typeCode' },
    this.columnDecoratorService.decorateColumn({ prop: 'parentCodeName' },
      (term: ITerm) => term.parentCodeName || term.parentCode),
    this.columnDecoratorService.decorateColumn({ prop: 'isClosed' },
      (term: ITerm) => term.isClosed ? `<i class="fa fa-check-square-o" aria-hidden="true"></i>` : '')
  ];

  dataSource: IDataSource = {
    read: '/api/dictionaries/{code}/terms',
    dataKey: 'terms',
  };

  constructor(private gridService: GridService,
              private columnDecoratorService: GridColumnDecoratorService) {
    super();
  }

  onEditSubmit(data: ITerm, createMode: boolean): void {
    if (Array.isArray(data.typeCode)) {
      data.typeCode = data.typeCode[0].value;
    }
    if (Array.isArray(data.parentCode)) {
      data.parentCode = data.parentCode[0].value;
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
