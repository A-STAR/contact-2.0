import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { map, first, filter, switchMap } from 'rxjs/operators';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { IDictionary, ITerm } from '../dictionaries.interface';
import { ToolbarItemType, Toolbar } from '@app/shared/components/toolbar/toolbar.interface';

import { DictionariesService } from '../dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '@app/core/dialog';

import { combineLatestAnd } from '@app/core/utils/helpers';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { addGridLabel, isEmpty } from '@app/core/utils';

@Component({
  host: { class: 'full-size' },
  selector: 'app-dict',
  templateUrl: './dict.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictComponent extends DialogFunctions implements OnDestroy, OnInit {
  readonly dictionaries: Observable<IDictionary[]> = this.dictionariesService.dictionaries;
  readonly dictionaryTermTypes: Observable<ITerm[]> = this.dictionariesService.dictionaryTermTypes;
  readonly selectedDictionary: Observable<IDictionary> = this.dictionariesService.selectedDictionary;
  readonly hasDictionaryRelations: Observable<boolean> = combineLatestAnd([
      this.selectedDictionary.pipe(map(Boolean)),
      this.dictionaryTermTypes.pipe(map(Boolean))
    ]);
  readonly canEdit: Observable<boolean> = this.userPermissionsService.has('DICT_EDIT');

  toolbarItems: Toolbar = {
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        action: () => this.create(),
        enabled: this.userPermissionsService.has('DICT_ADD')
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        action: () => this.edit(),
        enabled: combineLatestAnd([
          this.canEdit,
          this.dictionariesService.hasSelectedDictionary
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        action: () => this.setDialog('remove'),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('DICT_DELETE'),
          this.dictionariesService.hasSelectedDictionary
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.dictionariesService.fetchDictionaries()
      }
    ]
  };

  dialog: 'create' | 'edit' | 'remove';
  dictionary: IDictionary;

  viewPermission$: Observable<boolean>;
  emptyMessage$: Observable<string>;

  columns: ISimpleGridColumn<IDictionary>[] = [
    { prop: 'code', minWidth: 50, maxWidth: 70 },
    { prop: 'name', maxWidth: 300 },
    { prop: 'parentCode', width: 200, lookupKey: 'dictionaries' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_DICTIONARY_TYPE },
    { prop: 'termTypeCode', dictCode: UserDictionariesService.DICTIONARY_TERM_TYPES },
  ].map(addGridLabel('dictionaries.grid'));
  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dictionariesService: DictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.dictionariesService.fetchTermTypes();
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

  onSelect(dictionaries: IDictionary[]): void {
    const dictionary = isEmpty(dictionaries)
      ? null
      : dictionaries[0];
    this.dictionariesService.selectDictionary(dictionary);
  }
}
