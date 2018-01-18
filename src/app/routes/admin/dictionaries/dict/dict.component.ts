import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators/first';
import { filter } from 'rxjs/operators/filter';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { switchMap } from 'rxjs/operators';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IDictionary, ITerm } from '../dictionaries.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DictionariesService } from '../dictionaries.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

import { combineLatestAnd } from '../../../../core/utils/helpers';
import { DialogFunctions } from '../../../../core/dialog';

@Component({
  selector: 'app-dict',
  templateUrl: './dict.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictComponent extends DialogFunctions implements OnDestroy, OnInit {

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.create(),
      enabled: this.userPermissionsService.has('DICT_ADD')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.edit(),
      enabled: combineLatestAnd([
        this.canEdit,
        this.dictionariesService.hasSelectedDictionary
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('remove'),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('DICT_DELETE'),
        this.dictionariesService.hasSelectedDictionary
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.dictionariesService.fetchDictionaries()
    }
  ];

  columns: IGridColumn[];
  dialog: 'create' | 'edit' | 'remove';
  dictionary: IDictionary;

  viewPermission$: Observable<boolean>;
  emptyMessage$: Observable<string>;

  private _columns: IGridColumn[] = [
    { prop: 'code', minWidth: 50, maxWidth: 70 },
    { prop: 'name', maxWidth: 300 },
    { prop: 'parentCode', width: 200, lookupKey: 'dictionaries' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_DICTIONARY_TYPE },
    { prop: 'termTypeCode', dictCode: UserDictionariesService.DICTIONARY_TERM_TYPES },
  ];
  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dictionariesService: DictionariesService,
    private gridService: GridService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.dictionariesService.fetchTermTypes();
    this.gridService.setAllRenderers(this._columns)
      .pipe(
        first()
      )
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.viewPermission$ = this.userPermissionsService.has('DICT_VIEW');
    this.viewPermissionSubscription = this.viewPermission$.subscribe(canView =>
      canView
        ? this.dictionariesService.fetchDictionaries()
        : this.dictionariesService.clearDictionaries()
    );

    this.emptyMessage$ = this.viewPermission$.map(canView => canView ? null : 'dictionaries.errors.view');
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
  }

  get dictionaries(): Observable<IDictionary[]> {
    return this.dictionariesService.dictionaries;
  }

  get dictionaryTermTypes(): Observable<ITerm[]> {
    return this.dictionariesService.dictionaryTermTypes;
  }

  get hasDictionaryRelations(): Observable<boolean> {
    return combineLatestAnd([
      this.selectedDictionary.map(Boolean),
      this.dictionaryTermTypes.map(Boolean)
    ]);
  }

  get selectedDictionary(): Observable<IDictionary> {
    return this.dictionariesService.selectedDictionary;
  }

  get canEdit(): Observable<boolean> {
    return this.userPermissionsService.has('DICT_EDIT');
  }

  edit(): void {
    this.hasDictionaryRelations
      .pipe(
        filter(Boolean),
        switchMap(_ => this.dictionariesService.selectedDictionary),
        first(),
      )
      .subscribe(dictionary => {
        this.dictionary = { ...dictionary };
        this.setDialog('edit');
        this.cdRef.markForCheck();
      });
  }

  create(): void {
    this.dictionaryTermTypes.map(Boolean)
      .pipe(
        filter(Boolean),
        first(),
      )
      .subscribe(_ => {
        this.setDialog('create');
        this.cdRef.markForCheck();
      });
  }

  onCancel(): void {
    this.setDialog();
  }

  onUpdate(dictionary: IDictionary): void {
    this.dictionariesService.updateDictionary(dictionary);
    this.setDialog();
  }

  onCreate(dictionary: IDictionary): void {
    this.dictionariesService.createDictionary(dictionary);
    this.setDialog();
  }

  onRemove(): void {
    this.dictionariesService.deleteDictionary();
    this.setDialog();
  }

  onSelect(dictionary: IDictionary): void {
    this.dictionariesService.selectDictionary(dictionary);
  }
}
