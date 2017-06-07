import { Component } from '@angular/core';

import { IAppState } from '../../../../core/state/state.interface';
import { IDictionary, ITerm, DictionariesDialogActionEnum } from '../../../../core/dictionaries/dictionaries.interface';
import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DictionariesService } from '../../../../core/dictionaries/dictionaries.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent {

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON,
      action: () => this.dictionariesService.setDialogAddTermAction(),
      icon: 'fa fa-plus',
      label: 'toolbar.action.add',
      permissions: [ 'DICT_TERM_ADD' ],
      disabled: (state: IAppState) => state.dictionaries.selectedDictionaryCode === null
    },
    {
      type: ToolbarItemTypeEnum.BUTTON,
      action: () => this.dictionariesService.setDialogEditTermAction(),
      icon: 'fa fa-pencil',
      label: 'toolbar.action.edit',
      permissions: [ 'DICT_TERM_EDIT' ],
      disabled: (state: IAppState) => state.dictionaries.selectedTermId === null
    },
    {
      type: ToolbarItemTypeEnum.BUTTON,
      action: () => this.dictionariesService.setDialogRemoveTermAction(),
      icon: 'fa fa-trash',
      label: 'toolbar.action.remove',
      permissions: [ 'DICT_TERM_DELETE' ],
      disabled: (state: IAppState) => state.dictionaries.selectedTermId === null
    },
    {
      type: ToolbarItemTypeEnum.BUTTON,
      action: () => this.dictionariesService.fetchTerms(),
      icon: 'fa fa-refresh',
      label: 'toolbar.action.refresh'
    }
  ];

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

  action: DictionariesDialogActionEnum = null;

  masterEntity: IDictionary;

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
      this.masterEntity = state.dictionaries.find(dictionary => dictionary.code === state.selectedDictionaryCode);
    });

    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  get isEntityBeingCreated(): boolean {
    return this.action === DictionariesDialogActionEnum.TERM_ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.action === DictionariesDialogActionEnum.TERM_EDIT;
  }

  get isEntityBeingRemoved(): boolean {
    return this.action === DictionariesDialogActionEnum.TERM_REMOVE;
  }

  onEditSubmit(data: ITerm, createMode: boolean): void {
    data.typeCode = this.valueConverterService.firstLabeledValue(data.typeCode);
    data.parentCode = this.valueConverterService.firstLabeledValue(data.parentCode);
    data.isClosed = this.valueConverterService.toBooleanNumber(data.isClosed);

    if (createMode) {
      this.dictionariesService.createTerm(data);
    } else {
      this.dictionariesService.updateTerm(data);
    }
  }

  onRemoveSubmit(): void {
    this.dictionariesService.deleteTerm();
  }

  cancelAction(): void {
    this.dictionariesService.setDialogAction(null);
  }

  onEdit(): void {
    this.dictionariesService.setDialogEditTermAction();
  }

  onSelectedRowChange(terms: Array<ITerm>): void {
    const term = terms[0];
    const selectedTermId = this.selectedEntity && this.selectedEntity.id;
    if (term && term.id !== selectedTermId) {
      this.dictionariesService.selectTerm(term.id);
    }
  }
}
