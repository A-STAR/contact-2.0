import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';

import { ITerm } from './terms.interface';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { GridColumnDecoratorService } from '../../../../shared/components/grid/grid.column.decorator.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';
import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent extends GridEntityComponent<ITerm> {

  bottomActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: false, permission: 'DICT_TERM_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'DICT_TERM_EDIT' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'DICT_TERM_DELETE' },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
  ];

  bottomActionsMasterGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.ADD
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<any> = [
    { prop: 'code', minWidth: 100, maxWidth: 150 },
    { prop: 'name', maxWidth: 400 },
    this.columnDecoratorService.decorateRelatedEntityColumn({prop: 'typeCode'},
      // TODO Duplication
      Observable.of([
        { label: 'dictionaries.types.system', value: 1 },
        { label: 'dictionaries.types.client', value: 2 }
      ]),
      true
    ),
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
              private valueConverterService: ValueConverterService,
              private columnDecoratorService: GridColumnDecoratorService) {
    super();
  }

  onEditSubmit(data: ITerm, createMode: boolean): void {
    data.typeCode = this.valueConverterService.firstLabeledValue(data.typeCode as Array<ILabeledValue>);
    data.parentCode = this.valueConverterService.firstLabeledValue(data.parentCode as Array<ILabeledValue>);
    data.isClosed = this.valueConverterService.toNumber(data.isClosed);

    if (createMode) {
      this.gridService.create('/api/dictionaries/{code}/terms', this.masterEntity, data)
        .subscribe(() => this.onSuccess());
    } else {
      const termsId: number = this.selectedEntity.id;
      this.gridService.update(`/api/dictionaries/{code}/terms/${termsId}`, this.masterEntity, data)
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
