import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { ILabeledValue } from '../../../../core/converter/value-converter.interface';
import { IEntityTranslation } from '../../../../core/entity/translations/entity-translations.interface';
import { IDictionary, DictionariesDialogActionEnum, ITerm } from '../../../../core/dictionaries/dictionaries.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';
import { ILookupLanguage } from '../../../../core/lookup/lookup.interface';

import { DictionariesService } from '../../../../core/dictionaries/dictionaries.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { LookupService } from '../../../../core/lookup/lookup.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserDictionaries2Service } from '../../../../core/user/dictionaries/user-dictionaries-2.service';

@Component({
  selector: 'app-dict',
  templateUrl: './dict.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        this.dictionariesService.selectedDictionary
      ).map(([hasPermissions, selectedDictionary]) => hasPermissions && !!selectedDictionary)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dictionariesService.setDialogRemoveDictionaryAction(),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('DICT_DELETE'),
        this.dictionariesService.selectedDictionary
      ).map(([hasPermissions, selectedDictionary]) => hasPermissions && !!selectedDictionary)
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
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_TERM_TYPES },
    { prop: 'termTypeCode', dictCode: UserDictionariesService.DICTIONARY_DICTIONARY_TYPE },
  ];

  renderers: IRenderer = {};

  hasViewPermission$: Observable<boolean>;
  emptyMessage$: Observable<string>;

  private columns$: Observable<IGridColumn[]>;
  private dictionariesService$: Subscription;
  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dictionariesService: DictionariesService,
    private gridService: GridService,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionaries2Service,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {

    const dictionaryIds = this.columns.map(col => col.dictCode).filter(Boolean);
    this.dictionariesService$ = Observable.combineLatest(
      this.userDictionariesService.getDictionaries(dictionaryIds),
      this.dictionariesService.state
    )
    .map(([dictionaries, dicState]) => {
      // Get the dictionaries and convert them to renderers
      this.columns.filter(col => !!col.dictCode)
        .map(col => {
          const dictionary = dictionaries[col.dictCode].map(term => ({ label: term.name, value: term.code }));
          this.renderers[col.prop] = dictionary;
        });
      this.renderers.parentCode = dicState.dictionaries.map(dict => ({ label: dict.name, value: dict.code }));
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    })
    .subscribe(() => this.cdRef.markForCheck());

    // this.dictionariesService$ = this.dictionariesService.state.subscribe(state => {
    //   this.renderers.parentCode = state.dictionaries.map(dict => ({ label: dict.name, value: dict.code }));
    //   this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    // });

    this.hasViewPermission$ = this.userPermissionsService.has('DICT_VIEW');
    this.viewPermissionSubscription = this.hasViewPermission$.subscribe(hasViewPermission =>
      hasViewPermission ? this.dictionariesService.fetchDictionaries() : this.dictionariesService.clearDictionaries()
    );

    this.emptyMessage$ = this.hasViewPermission$.map(hasPermission => hasPermission ? null : 'dictionaries.errors.view');
  }

  ngOnDestroy(): void {
    this.dictionariesService$.unsubscribe();
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
    return Observable.combineLatest(this.languages, this.dictionaryTermTypes)
      .map(([languages, dictionaryTermTypes]) => languages && !!dictionaryTermTypes);
  }

  get selectedDictionary(): Observable<IDictionary> {
    return this.dictionariesService.selectedDictionary;
  }

  get isReadyForCreating(): Observable<boolean> {
    return Observable.combineLatest(
      this.isEntityBeingCreated,
      this.isDictionaryRelationsReady,
    ).map(([isEntityBeingCreated, isDictionaryRelationsReady]) => isEntityBeingCreated && isDictionaryRelationsReady);
  }

  get isReadyForEditing(): Observable<boolean> {
    return Observable.combineLatest(
      this.isEntityBeingEdited,
      this.isDictionaryRelationsReady,
      this.dictionariesService.isSelectedDictionaryReady,
    ).map(([isEntityBeingEdited, isRelationsReady, isSelectedDictionaryReady]) =>
        isEntityBeingEdited && isRelationsReady && isSelectedDictionaryReady);
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
    this.dictionariesService.selectDictionary(dictionary);
  }
}
