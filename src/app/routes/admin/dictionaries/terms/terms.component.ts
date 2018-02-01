import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first, filter, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { ITerm } from '../dictionaries.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';

import { DictionariesService } from '../dictionaries.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '../../../../core/utils/helpers';
import { DialogFunctions } from '../../../../core/dialog';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent extends DialogFunctions implements OnInit, OnDestroy {

  titlebar: ITitlebar = {
    title: 'terms.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_ADD,
        action: () => this.create(),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('DICT_TERM_ADD'),
          this.dictionariesService.hasSelectedDictionary
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_EDIT,
        action: () => this.edit(),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('DICT_TERM_EDIT'),
          this.dictionariesService.hasSelectedTerm
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_DELETE,
        action: () => this.setDialog('remove'),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('DICT_TERM_DELETE'),
          this.dictionariesService.hasSelectedTerm
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_REFRESH,
        action: () => this.dictionariesService.fetchTerms(),
        enabled: this.dictionariesService.hasSelectedDictionary
      }
    ]
  };

  columns: Array<IGridColumn> = [
    { prop: 'code', minWidth: 50, maxWidth: 70 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_DICTIONARY_TYPE },
    { prop: 'parentCodeName', renderer: (term: ITerm) => term.parentCodeName || term.parentCode || '' },
    { prop: 'isClosed', renderer: 'checkboxRenderer' },
  ];

  emptyMessage$: Observable<string>;
  canView$: Observable<boolean>;
  dialog: 'create' | 'edit' | 'remove';

  rows = [];
  term: ITerm;

  private dictionariesServiceSubscription: Subscription;
  private viewPermissionsSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dictionariesService: DictionariesService,
    private gridService: GridService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .map(columns => {
        this.columns = [ ...columns ];
      })
      .pipe(first())
      .subscribe();

    this.dictionariesServiceSubscription = this.dictionariesService.state
      .subscribe(state => {
        this.rows = state.terms;
        this.cdRef.markForCheck();
      });

    this.canView$ = this.userPermissionsService.has('DICT_TERM_VIEW');

    this.viewPermissionsSubscription = this.canView$
      .subscribe(canView => {
        if (!canView) {
          this.dictionariesService.clearTerms();
        } else {
          this.dictionariesService.fetchTerms();
        }
        this.cdRef.markForCheck();
      });

    this.emptyMessage$ = this.canView$.map(canView => canView ? null : 'terms.errors.view');
  }

  ngOnDestroy(): void {
    this.dictionariesServiceSubscription.unsubscribe();
    this.viewPermissionsSubscription.unsubscribe();
  }

  get canEdit(): Observable<boolean> {
    return this.userPermissionsService.has('DICT_TERM_EDIT');
  }

  get disableParentSelection(): Observable<boolean> {
    return this.dictionariesService.selectedDictionary
      .map(dict => !dict.parentCode);
  }

  get selectedTerm(): Observable<ITerm> {
    return this.dictionariesService.selectedTerm;
  }

  get terms(): Observable<ITerm[]> {
    return this.dictionariesService.terms;
  }

  get dropdownTerms(): Observable<ITerm[]> {
    return this.dictionariesService.dropdownTerms;
  }

  get hasDropdownTerms(): Observable<boolean> {
    return this.dropdownTerms.map(terms => !!terms);
  }

  onRemove(): void {
    this.dictionariesService.deleteTerm();
    this.setDialog();
  }

  onCancel(): void {
    this.setDialog();
  }

  edit(): void {
    combineLatestAnd([
      this.userPermissionsService.has('DICT_TERM_EDIT'),
      this.hasDropdownTerms,
    ])
    .pipe(
      filter(Boolean),
      switchMap(_ => this.dictionariesService.selectedTerm),
      first()
    )
    .subscribe(term => {
      this.term = { ...term };
      this.setDialog('edit');
      this.cdRef.markForCheck();
    });
  }

  create(): void {
    combineLatestAnd([
      this.userPermissionsService.has('DICT_TERM_ADD'),
      this.hasDropdownTerms,
    ])
    .pipe(
      filter(Boolean),
      first()
    )
    .subscribe(_ => {
      this.setDialog('create');
      this.cdRef.markForCheck();
    });
  }

  onUpdate(term: ITerm): void {
    this.dictionariesService.updateTerm(term);
    this.setDialog();
  }

  onCreate(data: ITerm): void {
    this.dictionariesService.createTerm(data);
    this.setDialog();
  }

  onSelect(term: ITerm): void {
    this.dictionariesService.selectTerm(term);
  }
}
