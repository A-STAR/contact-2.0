import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDictionary, ITerm, DictionariesDialogActionEnum } from '../../../../core/dictionaries/dictionaries.interface';
import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DictionariesService } from '../../../../core/dictionaries/dictionaries.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent implements OnDestroy {

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.dictionariesService.setDialogAddTermAction(),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('DICT_TERM_ADD'),
        this.dictionariesService.state.map(state => !!state.selectedDictionaryCode)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.dictionariesService.setDialogEditTermAction(),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('DICT_TERM_EDIT'),
        this.dictionariesService.state.map(state => !!state.selectedTermId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dictionariesService.setDialogRemoveTermAction(),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('DICT_TERM_DELETE'),
        this.dictionariesService.state.map(state => !!state.selectedTermId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.dictionariesService.fetchTerms(),
      enabled: this.dictionariesService.state.map(state => !!state.selectedDictionaryCode)
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

  private dictionariesService$: Subscription;

  constructor(
    private dictionariesService: DictionariesService,
    private gridService: GridService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    this.dictionariesService$ = this.dictionariesService.state.subscribe(state => {
      this.action = state.dialogAction;
      this.rows = state.terms;
      this.selectedEntity = state.terms.find(term => term.id === state.selectedTermId);
      this.masterEntity = state.dictionaries.find(dictionary => dictionary.code === state.selectedDictionaryCode);
    });

    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  ngOnDestroy(): void {
    this.dictionariesService$.unsubscribe();
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
    data.isClosed = Number(data.isClosed);

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

  onSelect(term: ITerm): void {
    const selectedTermId = this.selectedEntity && this.selectedEntity.id;
    if (term && term.id !== selectedTermId) {
      this.dictionariesService.selectTerm(term.id);
    }
  }
}
