import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';
import { IEntityTranslation } from '../../../../core/entity/translations/entity-translations.interface';
import { IDictionary, DictionariesDialogActionEnum, ITerm } from '../../../../core/dictionaries/dictionaries.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';
import { IUserLanguage } from '../../../../core/user/languages/user-languages.interface';

import { DictionariesService } from '../../../../core/dictionaries/dictionaries.service';
import { EntityTranslationsService } from '../../../../core/entity/translations/entity-translations.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { UserLanguagesService } from '../../../../core/user/languages/user-languages.service';

@Component({
  selector: 'app-dict',
  templateUrl: './dict.component.html'
})
export class DictComponent implements OnDestroy {

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.dictionariesService.setDialogAddDictionaryAction(),
      enabled: this.userPermissionsService.has('DICT_ADD')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.dictionariesService.setDialogEditDictionaryAction(),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('DICT_EDIT'),
        this.dictionariesService.state.map(state => !!state.selectedDictionaryCode)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dictionariesService.setDialogRemoveDictionaryAction(),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('DICT_DELETE'),
        this.dictionariesService.state.map(state => !!state.selectedDictionaryCode)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.dictionariesService.fetchDictionaries()
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
  languages: IUserLanguage[];
  dictionaryTermTypes: ITerm[];

  hasViewPermission$: Observable<boolean>;

  emptyMessage$: Observable<string>;

  private dictionariesService$: Subscription;
  private dictionariesRelations$: Subscription;
  private viewPermissionSubscription: Subscription;

  constructor(
    private dictionariesService: DictionariesService,
    private gridService: GridService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
    private entityTranslationsService: EntityTranslationsService,
    private userLanguagesService: UserLanguagesService,
  ) {
    this.dictionariesService$ = this.dictionariesService.state.subscribe(state => {
      this.action = state.dialogAction;
      this.rows = state.dictionaries;
      this.selectedEntity = state.dictionaries.find(dictionary => dictionary.code === state.selectedDictionaryCode);

      this.renderers.parentCode = state.dictionaries.map(dict => ({ label: dict.name, value: dict.code }));
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    });

    this.dictionariesRelations$ = Observable.combineLatest(
      this.userLanguagesService.userLanguages,
      this.dictionariesService.state,
    )
    .subscribe(([languages, dictionaries]) => {
      this.languages = languages;
      this.dictionaryTermTypes = dictionaries.dictionaryTermTypes;
    });

    this.hasViewPermission$ = this.userPermissionsService.has('DICT_VIEW');
    this.viewPermissionSubscription = this.hasViewPermission$.subscribe(hasViewPermission =>
      hasViewPermission ? this.dictionariesService.fetchDictionaries() : this.dictionariesService.clearDictionaries()
    );

    this.emptyMessage$ = this.hasViewPermission$.map(hasPermission => hasPermission ? null : 'dictionaries.errors.view');
  }

  ngOnDestroy(): void {
    this.dictionariesService$.unsubscribe();
    this.dictionariesRelations$.unsubscribe();
    this.viewPermissionSubscription.unsubscribe();
  }

  get isEntityBeingCreated(): boolean {
    return this.action === DictionariesDialogActionEnum.DICTIONARY_ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.action === DictionariesDialogActionEnum.DICTIONARY_EDIT && this.isReadyForEditing;
  }

  get isEntityBeingRemoved(): boolean {
    return this.action === DictionariesDialogActionEnum.DICTIONARY_REMOVE;
  }

  get isReadyForEditing(): boolean {
    return this.selectedEntity
      && this.selectedEntity.nameTranslations
      && !!this.dictionaryTermTypes
      && !!this.languages;
  }

  onEdit(): void {
    this.userPermissionsService.has('DICT_EDIT')
      .take(1)
      .subscribe(hasEditPermission => {
        if (hasEditPermission) {
          this.editHandler();
        }
      });
  }

  private editHandler(): void {
    this.languages = null;
    this.dictionaryTermTypes = null;
    this.selectedEntity.nameTranslations = null;

    this.dictionariesService.setDialogAction(DictionariesDialogActionEnum.DICTIONARY_EDIT);

    this.entityTranslationsService.readDictNameTranslations(this.selectedEntity.id)
      .take(1)
      .subscribe((translations: IEntityTranslation[]) => this.loadNameTranslations(translations));
  }

  cancelAction(): void {
    this.dictionariesService.setDialogAction(null);
  }

  loadNameTranslations(currentTranslations: IEntityTranslation[]): void {
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

  onSelect(dictionary: IDictionary): void {
    const selectedDictionaryId = this.selectedEntity && this.selectedEntity.id;
    if (dictionary && dictionary.id !== selectedDictionaryId) {
      this.dictionariesService.selectDictionary(dictionary.code);
    }
  }
}
