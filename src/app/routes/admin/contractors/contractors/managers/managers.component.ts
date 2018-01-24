import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { RoutingService } from '@app/core/routing/routing.service';
import { ActivatedRoute, Router} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '../../../../../core/state/state.interface';
import { IContractorManager, IActionType } from '../../contractors-and-portfolios.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '../../../../../core/utils/helpers';
import { DialogFunctions } from '../../../../../core/dialog';

@Component({
  selector: 'app-contractor-managers',
  templateUrl: './managers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorManagersComponent extends DialogFunctions implements OnDestroy, OnInit {

  dialog: string;

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
        this.store.select(state => state.contractorsAndPortfolios.selectedManager).map(o => !!o)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('delete'),
      enabled: combineLatestAnd([
        this.canDelete$,
        this.store.select(state => state.contractorsAndPortfolios.selectedManager).map(o => !!o)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchAll(),
      enabled: this.canView$
    }
  ];

  columns: Array<IGridColumn> = [
    // { prop: 'fullName' },
    { prop: 'lastName', minWidth: 120, maxWidth: 200 },
    { prop: 'firstName', minWidth: 120, maxWidth: 200 },
    { prop: 'middleName', minWidth: 120, maxWidth: 200 },
    { prop: 'genderCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_GENDER },
    { prop: 'position', minWidth: 100, maxWidth: 150 },
    { prop: 'branchCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_BRANCHES },
    { prop: 'mobPhone', minWidth: 100, maxWidth: 150 },
    { prop: 'workPhone', minWidth: 100, maxWidth: 150 },
    { prop: 'intPhone', minWidth: 100, maxWidth: 150 },
    { prop: 'workAddress', minWidth: 100, maxWidth: 250 },
    { prop: 'email', minWidth: 100, maxWidth: 200 },
    { prop: 'comment', minWidth: 100, maxWidth: 250 },
  ];

  private contractorId = (<any>this.route.params).value.contractorId;
  private canViewSubscription: Subscription;
  private managersSubscription: Subscription;

  managers: IContractorManager[];
  selection: IContractorManager[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private routingService: RoutingService,
    private router: Router,
    private store: Store<IAppState>,
    private route: ActivatedRoute,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .subscribe(columns => {
        this.columns = [...columns];
      });

    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.fetchAll();
      } else {
        this.clearManagers();
        this.notificationsService.error('errors.default.read.403').entity('entities.managers.gen.plural').dispatch();
      }
    });

    this.managersSubscription = this.contractorsAndPortfoliosService.getAction(IActionType.MANAGERS_FETCH)
      .subscribe(action => {
        this.fetchAll();
      });
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.managersSubscription.unsubscribe();
  }

  clearManagers (): void {
    this.contractorsAndPortfoliosService.selectManager(null);
    this.managers = [];
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_DELETE');
  }

  onAdd(): void {
    this.router.navigate([`/admin/contractors/${this.contractorId}/managers/create`]);
  }

  onEdit(): void {
    this.router.navigate([`/admin/contractors/${this.contractorId}/managers/${this.selection[0].id}`]);
  }

  onSelect(manager: IContractorManager): void {
    this.selection = [manager];
    this.contractorsAndPortfoliosService.selectManager(manager);
  }

  onBack(): void {
    this.routingService.navigate([ `/admin/contractors/${this.contractorId}` ], this.route);
  }

  onRemoveSubmit(): void {
    this.contractorsAndPortfoliosService.deleteManager(this.contractorId, this.selection[0].id)
      .subscribe(() => {
        this.setDialog();
        this.fetchAll();
      });
  }

  onCloseDialog(): void {
    this.setDialog();
  }

  private fetchAll(): void {
    this.contractorsAndPortfoliosService.readManagersForContractor(this.contractorId)
      .subscribe(managers => {
        this.selection = [];
        this.contractorsAndPortfoliosService.selectManager(null);
        this.managers = managers;
        this.cdRef.detectChanges();
      });
  }
}
