import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ILookupLanguage } from '../../../../core/lookup/lookup.interface';
import { ILabeledValue } from '../../../../core/converter/value-converter.interface';
import { IEntityTranslation } from '../../../../core/entity/translations/entity-translations.interface';
import { IDictionary, ITerm, DictionariesDialogActionEnum } from '../../../../core/dictionaries/dictionaries.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DictionariesService } from '../../../../core/dictionaries/dictionaries.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { LookupService } from '../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '../../../../core/utils/helpers';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent implements OnInit, OnDestroy {

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.dictionariesService.setDialogAddTermAction(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('DICT_TERM_ADD'),
        this.dictionariesService.isSelectedDictionaryExist
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.dictionariesService.setDialogEditTermAction(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('DICT_TERM_EDIT'),
        this.dictionariesService.isSelectedTermExist
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dictionariesService.setDialogRemoveTermAction(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('DICT_TERM_DELETE'),
        this.dictionariesService.isSelectedTermExist
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.dictionariesService.fetchTerms(),
      enabled: this.dictionariesService.isSelectedDictionaryExist
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'code', minWidth: 50, maxWidth: 70 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_DICTIONARY_TYPE },
    { prop: 'parentCodeName', renderer: (term: ITerm) => term.parentCodeName || term.parentCode || '' },
    { prop: 'isClosed', renderer: 'checkboxRenderer' },
  ];

  rows = [];

  action: DictionariesDialogActionEnum = null;

  masterEntity: IDictionary;

  hasViewPermission$: Observable<boolean>;

  emptyMessage$: Observable<string>;

  private dictionariesServiceSubscription: Subscription;
  private viewPermissionsSubscription: Subscription;

  constructor(
    private dictionariesService: DictionariesService,
    private gridService: GridService,
    private lookupService: LookupService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .map(columns => {
        this.columns = [ ...columns ];
      })
      .take(1)
      .subscribe();

    this.dictionariesServiceSubscription = this.dictionariesService.state.subscribe(state => {
      this.action = state.dialogAction;
      this.rows = state.terms;
      this.masterEntity = state.selectedDictionary;
    });

    this.hasViewPermission$ = this.userPermissionsService.has('DICT_TERM_VIEW');

    this.viewPermissionsSubscription = this.hasViewPermission$.subscribe(hasViewPermission => {
      if (!hasViewPermission) {
        this.dictionariesService.clearTerms();
      } else {
        this.dictionariesService.fetchTerms();
      }
    });

    this.emptyMessage$ = this.hasViewPermission$.map(hasPermission => hasPermission ? null : 'terms.errors.view');
  }

  ngOnDestroy(): void {
    this.dictionariesServiceSubscription.unsubscribe();
    this.viewPermissionsSubscription.unsubscribe();
  }

  get selectedEntity(): Observable<ITerm> {
    return this.dictionariesService.selectedTerm;
  }

  get languages(): Observable<ILookupLanguage[]> {
    return this.lookupService.languages;
  }

  get terms(): Observable<ITerm[]> {
    return this.dictionariesService.terms;
  }

  get dropdownTerms(): Observable<ITerm[]> {
    return this.dictionariesService.dropdownTerms;
  }

  get isEntityBeingCreated(): Observable<boolean> {
    return this.dictionariesService.dialogAction
      .map(dialogAction => dialogAction === DictionariesDialogActionEnum.TERM_ADD);
  }

  get isEntityBeingEdited(): Observable<boolean> {
    return this.dictionariesService.dialogAction
      .map(dialogAction => dialogAction === DictionariesDialogActionEnum.TERM_EDIT);
  }

  get isEntityBeingRemoved(): Observable<boolean> {
    return this.dictionariesService.dialogAction
      .map(dialogAction => dialogAction === DictionariesDialogActionEnum.TERM_REMOVE);
  }

  get isReadyForCreating(): Observable<boolean> {
    return combineLatestAnd([
      this.isEntityBeingCreated,
      this.isTermRelationsReady,
      this.isDropdownTermsReady,
    ]);
  }

  get isReadyForEditing(): Observable<boolean> {
    return combineLatestAnd([
      this.isEntityBeingEdited,
      this.isTermRelationsReady,
      this.dictionariesService.isSelectedTermReady,
      this.isDropdownTermsReady,
    ]);
  }

  get isDropdownTermsReady(): Observable<boolean> {
    return this.dropdownTerms.map(terms => !!terms);
  }

  get isTermRelationsReady(): Observable<boolean> {
    return this.languages.map(languages => !!languages);
  }

  onRemoveSubmit(): void {
    this.dictionariesService.deleteTerm();
  }

  cancelAction(): void {
    this.dictionariesService.setTermDialogAction(null);
  }

  onEdit(term: ITerm): void {
    this.userPermissionsService.has('DICT_TERM_EDIT')
      .take(1)
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.dictionariesService.selectTerm(term);
          this.dictionariesService.setDialogEditTermAction();
        }
      });
  }

  onUpdateEntity(data: ITerm): void {
    const nameTranslations: Array<ILabeledValue> = data.nameTranslations || [];

    const deletedTranslations = nameTranslations
      .filter(item => item.removed)
      .map(item => item.value);

    const updatedTranslations: IEntityTranslation[] = nameTranslations
      .filter(item => !item.removed)
      .map(item => ({
        languageId: item.value,
        value: item.context ? item.context.translation : null
      }))
      .filter((item: IEntityTranslation) => item.value !== null);

    delete data.translatedName;
    delete data.nameTranslations;

    this.dictionariesService.updateTerm(data, deletedTranslations, updatedTranslations);
  }

  onCreateEntity(data: ITerm): void {
    this.dictionariesService.createTerm(data);
  }

  onSelect(term: ITerm): void {
    this.dictionariesService.selectTerm(term);
  }
}
