import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, first, filter, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ITerm } from '../dictionaries.interface';
import { ITitlebar, ToolbarItemType } from '@app/shared/components/titlebar/titlebar.interface';

import { DictionariesService } from '../dictionaries.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';
import { combineLatestAnd } from '@app/core/utils/helpers';
import { DialogFunctions } from '@app/core/dialog';

@Component({
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent extends DialogFunctions implements OnInit, OnDestroy {
  readonly canEdit: Observable<boolean> = this.userPermissionsService.has('DICT_TERM_EDIT');
  readonly disableParentSelection: Observable<boolean> = this.dictionariesService.selectedDictionary.pipe(
    map(dict => !dict.parentCode),
  );
  readonly selectedTerm: Observable<ITerm> = this.dictionariesService.selectedTerm;
  readonly terms: Observable<ITerm[]> = this.dictionariesService.terms;
  readonly dropdownTerms: Observable<ITerm[]> = this.dictionariesService.dropdownTerms;
  readonly hasDropdownTerms: Observable<boolean> = this.dropdownTerms.pipe(
    map(terms => !!terms),
  );

  titlebar: ITitlebar = {
    title: 'terms.title',
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        action: () => this.create(),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('DICT_TERM_ADD'),
          this.dictionariesService.hasSelectedDictionary
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        action: () => this.edit(),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('DICT_TERM_EDIT'),
          this.dictionariesService.hasSelectedTerm
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        action: () => this.setDialog('remove'),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('DICT_TERM_DELETE'),
          this.dictionariesService.hasSelectedTerm
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.dictionariesService.fetchTerms(),
        enabled: this.dictionariesService.hasSelectedDictionary
      }
    ]
  };

  columns: ISimpleGridColumn<ITerm>[] = [
    { prop: 'code', minWidth: 50, maxWidth: 70 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_DICTIONARY_TYPE },
    { prop: 'parentCodeName', rendererCallback: (term: ITerm) => term.parentCodeName || term.parentCode || '' },
    { prop: 'isClosed', renderer: TickRendererComponent },
  ].map(addGridLabel('terms.grid'));

  canView$: Observable<boolean>;
  dialog: 'create' | 'edit' | 'remove';

  rows = [];
  term: ITerm;

  private dictionariesServiceSubscription: Subscription;
  private viewPermissionsSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dictionariesService: DictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
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
  }

  ngOnDestroy(): void {
    this.dictionariesServiceSubscription.unsubscribe();
    this.viewPermissionsSubscription.unsubscribe();
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

  onSelect(terms: ITerm[]): void {
    this.dictionariesService.selectTerm(terms && terms[0]);
  }
}
