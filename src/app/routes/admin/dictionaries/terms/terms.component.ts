import { Component } from '@angular/core';

import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { ITerm } from './terms.interface';
import { ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';

import { DictionariesService } from '../../../../core/dictionaries/dictionaries.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent {

  toolbarItems = [];

  // toolbarActions: Array<IToolbarAction> = [
  //   { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: false, permission: 'DICT_TERM_ADD' },
  //   { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'DICT_TERM_EDIT' },
  //   { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'DICT_TERM_DELETE' },
  //   { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
  // ];

  // toolbarActionsMasterGroup: Array<ToolbarActionTypeEnum> = [
  //   ToolbarActionTypeEnum.ADD
  // ];

  // toolbarActionsGroup: Array<ToolbarActionTypeEnum> = [
  //   ToolbarActionTypeEnum.EDIT,
  //   ToolbarActionTypeEnum.REMOVE,
  // ];

  columns: Array<IGridColumn> = [
    { prop: 'code', minWidth: 100, maxWidth: 150 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'typeCode', localized: true },
    { prop: 'parentCodeName' },
    { prop: 'isClosed' },
  ];

  renderers: IRenderer = {
    typeCode: [
      { label: 'dictionaries.types.system', value: 1 },
      { label: 'dictionaries.types.client', value: 2 }
    ],
    parentCodeName: (term: ITerm) => term.parentCodeName || term.parentCode || '',
    isClosed: (term: ITerm) => term.isClosed ? `<i class="fa fa-check-square-o" aria-hidden="true"></i>` : ''
  };

  rows = [];

  action: any = null;

  selectedEntity: ITerm;

  constructor(
    private dictionariesService: DictionariesService,
    private gridService: GridService,
    private valueConverterService: ValueConverterService,
  ) {
    this.dictionariesService.state.subscribe(state => {
      this.action = state.dialogAction;
      this.rows = state.terms;
      this.selectedEntity = state.terms.find(term => term.id === state.selectedTermId);
    });

    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  get isEntityBeingCreated(): boolean {
    return this.action === ToolbarActionTypeEnum.ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.action === ToolbarActionTypeEnum.EDIT;
  }

  get isEntityBeingRemoved(): boolean {
    return this.action === ToolbarActionTypeEnum.REMOVE;
  }

  onEditSubmit(data: ITerm, createMode: boolean): void {
    data.typeCode = this.valueConverterService.firstLabeledValue(data.typeCode);
    data.parentCode = this.valueConverterService.firstLabeledValue(data.parentCode);
    data.isClosed = this.valueConverterService.toBooleanNumber(data.isClosed);

    if (createMode) {
      // this.gridService.create('/api/dictionaries/{code}/terms', this.masterEntity, data)
      //   .subscribe(() => this.onSuccess());
    } else {
      // const termsId: number = this.selectedEntity.id;
      // this.gridService.update(`/api/dictionaries/{code}/terms/${termsId}`, this.masterEntity, data)
      //   .subscribe(() => this.onSuccess());
    }
  }

  onRemoveSubmit(): void {
    // const termsId: number = this.selectedEntity.id;
    // this.gridService.delete(`/api/dictionaries/{code}/terms/${termsId}`, this.masterEntity)
    //   .subscribe(() => this.onSuccess());
  }

  onSuccess(): void {
    this.cancelAction();
    this.afterUpdate();
  }

  cancelAction(): void {
    this.action = null;
  }

  onEdit(): void {
    this.action = ToolbarActionTypeEnum.EDIT;
  }

  afterUpdate(): void {
    // this.selectedEntity = null;
    // this.loadGrid();
  }

  onSelectedRowChange(entities: Array<ITerm>): void {
    const entity = entities[0];
    this.action = null;

    if (entity) {
      // this.selectedEntity = entity;
      // this.refreshToolbar();
      // this.onSelect.emit(entity);
    }
  }
}
