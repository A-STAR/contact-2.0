import { Actions } from '@ngrx/effects';
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { IAppState } from '@app/core/state/state.interface';
import { IContractor, IActionType } from '@app/routes/admin/contractors/contractors-and-portfolios.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { Toolbar, ToolbarItemType } from '@app/shared/components/toolbar/toolbar.interface';

import { ContractorsAndPortfoliosService } from '@app/routes/admin/contractors/contractors-and-portfolios.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';

import { DialogFunctions } from '@app/core/dialog';

import { addGridLabel, combineLatestAnd, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-contractor-grid',
  templateUrl: './contractor-grid.component.html',
})
export class ContractorGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(SimpleGridComponent) grid: SimpleGridComponent<IContractor>;

  readonly canView$: Observable<boolean> = this.userPermissionsService.has('CONTRACTOR_VIEW');
  readonly canAdd$: Observable<boolean> = this.userPermissionsService.has('CONTRACTOR_ADD');
  readonly canEdit$: Observable<boolean> = this.userPermissionsService.has('CONTRACTOR_EDIT');
  readonly canDelete$: Observable<boolean> = this.userPermissionsService.has('CONTRACTOR_DELETE');

  toolbar: Toolbar = {
    label: 'contractors.title',
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        action: () => this.onAdd(),
        enabled: this.canAdd$
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        action: () => this.onEdit(),
        enabled: combineLatestAnd([
          this.canEdit$,
          this.store.select(state => state.contractorsAndPortfolios.selectedContractor).map(o => !!o)
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        action: () => this.setDialog('delete'),
        enabled: combineLatestAnd([
          this.canDelete$,
          this.store.select(state => state.contractorsAndPortfolios.selectedContractor).map(o => !!o),
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.fetchContractors(),
        enabled: this.canView$
      }
    ]
  };

  columns: ISimpleGridColumn<IContractor>[] = [
    { prop: 'id', minWidth: 50, maxWidth: 50 },
    { prop: 'name', minWidth: 120, maxWidth: 200 },
    { prop: 'fullName', minWidth: 120, maxWidth: 200 },
    { prop: 'smsName', minWidth: 120, maxWidth: 200 },
    { prop: 'responsibleFullName', minWidth: 100, maxWidth: 150 },
    { prop: 'typeCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE },
    { prop: 'phone', minWidth: 100, maxWidth: 150 },
    { prop: 'address', minWidth: 100, maxWidth: 250 },
    { prop: 'comment', minWidth: 100 },
  ].map(addGridLabel('contractors.grid'));

  contractors: IContractor[] = [];
  dialog: string;

  private actionsSub: Subscription;
  private canViewSubscription: Subscription;

  constructor(
    private actions$: Actions,
    private store: Store<IAppState>,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.fetchContractors();
      } else {
        this.clearSelection();
        this.notificationsService.permissionError().entity('entities.contractors.gen.plural').dispatch();
      }
    });

    this.actionsSub = this.actions$.subscribe(action => {
      if (action.type === IActionType.CONTRACTOR_SAVE) {
        this.fetchContractors();
      }
    });
  }

  ngOnDestroy(): void {
    this.actionsSub.unsubscribe();
    this.canViewSubscription.unsubscribe();
  }

  onAdd(): void {
    this.routingService.navigate([ 'create' ], this.route);
    this.contractorsAndPortfoliosService.dispatch(IActionType.CONTRACTOR_CREATE);
  }

  onEdit(): void {
    this.canEdit$
      .pipe(
        first(),
      )
      .subscribe(canEdit => {
        if (canEdit) {
          const { selection } = this.grid;
          this.routingService.navigate([ String(selection[0].id) ], this.route);
          this.contractorsAndPortfoliosService.dispatch(IActionType.CONTRACTOR_EDIT, {
            selectedContractor: selection[0]
          });
        }
      });
  }

  onSelect(contractors: IContractor[]): void {
    const contractor = isEmpty(contractors)
      ? null
      : contractors[0];
    this.contractorsAndPortfoliosService.selectContractor(contractor);
  }

  onRemove(): void {
    this.contractorsAndPortfoliosService.deleteContractor(this.grid.selection[0].id)
      .subscribe(() => {
        this.setDialog();
        this.fetchContractors();
      });
  }

  private fetchContractors(): void {
    this.contractorsAndPortfoliosService.readAllContractors()
      .pipe(first())
      .subscribe(contractors => {
        this.contractors = contractors;
        this.clearSelection();
        this.cdRef.markForCheck();
      });
  }

  private clearSelection(): void {
    this.contractorsAndPortfoliosService.selectContractor(null);
  }
}
