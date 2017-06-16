import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';
import { IEntityTranslation } from '../../../../core/entity/translations/entity-translations.interface';
import { IDictionary, DictionariesDialogActionEnum } from '../../../../core/dictionaries/dictionaries.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DictionariesService } from '../../../../core/dictionaries/dictionaries.service';
import { EntityTranslationsService } from '../../../../core/entity/translations/entity-translations.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { PermissionsService } from '../../../../core/permissions/permissions.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-dict',
  templateUrl: './dict.component.html'
})
export class DictComponent implements OnDestroy {

  private dictReady = false;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.dictionariesService.setDialogAddDictionaryAction(),
      disabled: this.permissionsService.hasPermission('DICT_ADD').map(hasPermission => !hasPermission)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.dictionariesService.setDialogEditDictionaryAction(),
      disabled: Observable.combineLatest(
        this.permissionsService.hasPermission('DICT_EDIT'),
        this.dictionariesService.state.map(state => state.selectedDictionaryCode)
      // TODO(d.maltsev): rename
      ).map(data => !data[0] || !data[1])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dictionariesService.setDialogRemoveDictionaryAction(),
      disabled: Observable.combineLatest(
        this.permissionsService.hasPermission('DICT_DELETE'),
        this.dictionariesService.state.map(state => state.selectedDictionaryCode)
      // TODO(d.maltsev): rename
      ).map(data => !data[0] || !data[1])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON,
      action: () => this.dictionariesService.fetchDictionaries(),
      icon: 'fa fa-refresh',
      label: 'toolbar.action.refresh'
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'code', minWidth: 100, maxWidth: 150 },
    { prop: 'name', maxWidth: 300 },
    { prop: 'parentCode', width: 200 },
    { prop: 'typeCode', localized: true },
  ];

  renderers: IRenderer = {
    parentCode: [],
    typeCode: [
      { label: 'dictionaries.types.system', value: 1 },
      { label: 'dictionaries.types.client', value: 2 }
    ]
  };

  action: DictionariesDialogActionEnum;

  selectedEntity: IDictionary;

  rows: Array<IDictionary>;

  private dictionariesService$: Subscription;

  constructor(
    private dictionariesService: DictionariesService,
    private gridService: GridService,
    private valueConverterService: ValueConverterService,
    private permissionsService: PermissionsService,
    private entityTranslationsService: EntityTranslationsService,
  ) {
    this.dictionariesService.fetchDictionaries();

    this.dictionariesService$ = this.dictionariesService.state.subscribe(state => {
      this.action = state.dialogAction;
      this.rows = state.dictionaries;
      this.selectedEntity = state.dictionaries.find(dictionary => dictionary.code === state.selectedDictionaryCode);

      this.renderers.parentCode = state.dictionaries.map(dict => ({ label: dict.name, value: dict.code }));
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    });
  }

  ngOnDestroy(): void {
    this.dictionariesService$.unsubscribe();
  }

  get isEntityBeingCreated(): boolean {
    return this.action === DictionariesDialogActionEnum.DICTIONARY_ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.action === DictionariesDialogActionEnum.DICTIONARY_EDIT;
  }

  get isEntityBeingRemoved(): boolean {
    return this.action === DictionariesDialogActionEnum.DICTIONARY_REMOVE;
  }

  get isReadyForEditing(): boolean {
    // TODO replace dictReady with router resolve
    return this.selectedEntity && this.dictReady;
  }

  onEdit(): void {
    this.dictReady = false;

    this.dictionariesService.setDialogAction(DictionariesDialogActionEnum.DICTIONARY_EDIT);

    this.entityTranslationsService.readDictNameTranslations(this.selectedEntity.id)
      .take(1)
      .subscribe((translations: IEntityTranslation[]) => this.loadNameTranslations(translations));
  }

  cancelAction(): void {
    this.dictionariesService.setDialogAction(null);
  }

  loadNameTranslations(currentTranslations: IEntityTranslation[]): void {
    this.dictReady = true;

    this.selectedEntity.nameTranslations = currentTranslations
      .map((entityTranslation: IEntityTranslation) => {
        return {
          value: entityTranslation.languageId,
          context: { translation: entityTranslation.value }
        };
      });
  }

  modifyEntity(data: IDictionary, editMode: boolean): void {
    data.typeCode = this.valueConverterService.firstLabeledValue(data.typeCode);
    data.parentCode = this.valueConverterService.firstLabeledValue(data.parentCode);
    data.termTypeCode = this.valueConverterService.firstLabeledValue(data.termTypeCode);

    if (editMode) {
      const nameTranslations: Array<ILabeledValue> = data.nameTranslations || [];

      const deletedTranslations = nameTranslations
        .filter((item: ILabeledValue) => item.removed)
        .map((item: ILabeledValue) => item.value);

      const updatedTranslations = nameTranslations
        .filter((item: ILabeledValue) => !item.removed)
        .map((item: ILabeledValue) => ({
          languageId: item.value,
          value: item.context ? item.context.translation : null
        }))
        .filter((item: IEntityTranslation) => item.value !== null);

      delete data.translatedName;
      delete data.nameTranslations;

      this.dictionariesService.updateDictionary(data, deletedTranslations, updatedTranslations);
    } else {
      this.dictionariesService.createDictionary(data);
    }
  }

  onUpdateEntity(data: IDictionary): void {
    this.modifyEntity(data, true);
  }

  onCreateEntity(data: IDictionary): void {
    this.modifyEntity(data, false);
  }

  onRemoveSubmit(): void {
    this.dictionariesService.deleteDictionary();
  }

  onSelectedRowChange(dictionaries: Array<IDictionary>): void {
    const dictionary = dictionaries[0];
    const selectedDictionaryId = this.selectedEntity && this.selectedEntity.id;
    if (dictionary && dictionary.id !== selectedDictionaryId) {
      this.dictionariesService.selectDictionary(dictionary.code);
    }
  }
}
