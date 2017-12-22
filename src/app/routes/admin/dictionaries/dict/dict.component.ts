import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';

import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { ILabeledValue } from '../../../../core/converter/value-converter.interface';
import { IEntityTranslation } from '../../../../core/entity/translations/entity-translations.interface';
import { IDictionary, DictionariesDialogActionEnum, ITerm } from '../dictionaries.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';
import { ILookupLanguage } from '../../../../core/lookup/lookup.interface';

import { DictionariesService } from '../dictionaries.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { LookupService } from '../../../../core/lookup/lookup.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

import { combineLatestAnd } from '../../../../core/utils/helpers';

@Component({
  selector: 'app-dict',
  templateUrl: './dict.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictComponent implements OnDestroy, OnInit {

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.dictionariesService.setDialogAddDictionaryAction(),
      enabled: this.userPermissionsService.has('DICT_ADD')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.dictionariesService.setDialogEditDictionaryAction(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('DICT_EDIT'),
        this.dictionariesService.selectedDictionary.map(Boolean)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dictionariesService.setDialogRemoveDictionaryAction(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('DICT_DELETE'),
        this.dictionariesService.selectedDictionary.map(Boolean)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.dictionariesService.fetchDictionaries()
    }
  ];

  columns: IGridColumn[] = [
    { prop: 'code', minWidth: 50, maxWidth: 70 },
    { prop: 'name', maxWidth: 300 },
    { prop: 'parentCode', width: 200 },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_DICTIONARY_TYPE },
    { prop: 'termTypeCode', dictCode: UserDictionariesService.DICTIONARY_TERM_TYPES },
  ];

  hasViewPermission$: Observable<boolean>;
  emptyMessage$: Observable<string>;

  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dictionariesService: DictionariesService,
    private gridService: GridService,
    private lookupService: LookupService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    combineLatest(
        this.areDictionariesFetched,
        this.dictionariesService.state,
        this.gridService.setDictionaryRenderers(this.columns)
      )
      .pipe(first())
      .subscribe(([_, state, columns]) => {
        const { dictionaries } = state;
        const renderers: IRenderer = { parentCode: dictionaries.map(dict => ({ label: dict.name, value: dict.code }))};
        this.columns = this.gridService.setRenderers(columns, renderers);
        this.cdRef.markForCheck();
      });

    this.hasViewPermission$ = this.userPermissionsService.has('DICT_VIEW');
    this.viewPermissionSubscription = this.hasViewPermission$.subscribe(hasViewPermission =>
      hasViewPermission ? this.dictionariesService.fetchDictionaries() : this.dictionariesService.clearDictionaries()
    );

    this.emptyMessage$ = this.hasViewPermission$.map(hasPermission => hasPermission ? null : 'dictionaries.errors.view');
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
  }

  get dictionaries(): Observable<IDictionary[]> {
    return this.dictionariesService.dictionaries;
  }

  get languages(): Observable<ILookupLanguage[]> {
    return this.lookupService.languages;
  }

  get dictionaryTermTypes(): Observable<ITerm[]> {
    return this.dictionariesService.dictionaryTermTypes;
  }

  get areDictionariesFetched(): Observable<boolean> {
    return this.dictionariesService.state
      .map(state => state.dictionaries)
      .map(dictionaries => !!dictionaries.length)
      .filter(Boolean);
  }

  get isEntityBeingCreated(): Observable<boolean> {
    return this.dictionariesService.dialogAction
      .map(dialogAction => dialogAction === DictionariesDialogActionEnum.DICTIONARY_ADD);
  }

  get isEntityBeingEdited(): Observable<boolean> {
    return this.dictionariesService.dialogAction
      .map(dialogAction => dialogAction === DictionariesDialogActionEnum.DICTIONARY_EDIT);
  }

  get isEntityBeingRemoved(): Observable<boolean> {
    return this.dictionariesService.dialogAction
      .map(dialogAction => dialogAction === DictionariesDialogActionEnum.DICTIONARY_REMOVE);
  }

  get isDictionaryRelationsReady(): Observable<boolean> {
    return combineLatestAnd([this.languages.map(Boolean), this.dictionaryTermTypes.map(Boolean)]);
  }

  get selectedDictionary(): Observable<IDictionary> {
    return this.dictionariesService.selectedDictionary;
  }

  get isReadyForCreating(): Observable<boolean> {
    return combineLatestAnd([
      this.isEntityBeingCreated,
      this.isDictionaryRelationsReady,
    ]);
  }

  get isReadyForEditing(): Observable<boolean> {
    return combineLatestAnd([
      this.isEntityBeingEdited,
      this.isDictionaryRelationsReady,
      this.dictionariesService.isSelectedDictionaryReady,
    ]);
  }

  get canEdit(): Observable<boolean> {
    return this.userPermissionsService.has('DICT_EDIT');
  }

  onEdit(dictionary: IDictionary): void {
    this.dictionariesService.selectDictionary(dictionary);
    this.dictionariesService.setDialogEditDictionaryAction();
  }

  cancelAction(): void {
    this.dictionariesService.setDictionaryDialogAction(null);
  }

  onUpdateEntity(data: IDictionary): void {
    const nameTranslations: Array<ILabeledValue> = data.nameTranslations || [];

    const deletedTranslations = nameTranslations
      .filter(item => item.removed)
      .map((item: ILabeledValue) => item.value);

    const updatedTranslations: IEntityTranslation[] = nameTranslations
      .filter(item => !item.removed)
      .map((item: ILabeledValue) => ({
        languageId: item.value,
        value: item.context ? item.context.translation : null
      }))
      .filter((item: IEntityTranslation) => item.value !== null);

    delete data.translatedName;
    delete data.nameTranslations;

    this.dictionariesService.updateDictionary(data, deletedTranslations, updatedTranslations);
  }

  onCreateEntity(data: IDictionary): void {
    this.dictionariesService.createDictionary(data);
  }

  onRemoveSubmit(): void {
    this.dictionariesService.deleteDictionary();
  }

  onSelect(dictionary: IDictionary): void {
    this.dictionariesService.selectDictionary(dictionary);
  }
}
