import { Actions } from '@ngrx/effects';
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '@app/core/state/state.interface';
import { IContractor, IActionType } from '@app/routes/admin/contractors/contractors-and-portfolios.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '@app/routes/admin/contractors/contractors-and-portfolios.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { GridComponent } from '@app/shared/components/grid/grid.component';

import { DialogFunctions } from '@app/core/dialog';
import { combineLatestAnd } from '@app/core/utils/helpers';

@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorsComponent extends DialogFunctions implements OnInit, OnDestroy {

  @ViewChild(GridComponent) grid: GridComponent;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onAdd(),
      enabled: this.canAdd$
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(),
      enabled: combineLatestAnd([
        this.canEdit$,
        this.store.select(state => state.contractorsAndPortfolios.selectedContractor).map(o => !!o)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('delete'),
      enabled: combineLatestAnd([
        this.canDelete$,
        this.store.select(state => state.contractorsAndPortfolios.selectedContractor).map(o => !!o),
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchContractors(),
      enabled: this.canView$
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 50, maxWidth: 50 },
    { prop: 'name', minWidth: 120, maxWidth: 200 },
    { prop: 'fullName', minWidth: 120, maxWidth: 200 },
    { prop: 'smsName', minWidth: 120, maxWidth: 200 },
    { prop: 'responsibleFullName', minWidth: 100, maxWidth: 150 },
    { prop: 'typeCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE },
    { prop: 'phone', minWidth: 100, maxWidth: 150 },
    { prop: 'address', minWidth: 100, maxWidth: 250 },
    { prop: 'comment', minWidth: 100 },
  ];

  contractors: IContractor[] = [];
  dialog: string;

  private actionsSub: Subscription;
  private canViewSubscription: Subscription;

  constructor(
    private actions$: Actions,
    private store: Store<IAppState>,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
      });

    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.fetchContractors();
      } else {
        this.clearSelection();
        this.notificationsService.error('errors.default.read.403').entity('entities.contractors.gen.plural').dispatch();
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

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_DELETE');
  }

  onAdd(): void {
    this.routingService.navigate([ 'create' ], this.route);
    this.contractorsAndPortfoliosService.dispatch(IActionType.CONTRACTOR_CREATE);
  }

  onEdit(): void {
    this.routingService.navigate([ this.grid.selected[0].id ], this.route);
    this.contractorsAndPortfoliosService.dispatch(IActionType.CONTRACTOR_EDIT, {
      selectedContractor: this.grid.selected[0]
    });
  }

  onSelect(contractor: IContractor): void {
    this.contractorsAndPortfoliosService.selectContractor(contractor);
  }

  onRemove(): void {
    this.contractorsAndPortfoliosService.deleteContractor(this.grid.selected[0].id)
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
