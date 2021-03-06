import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators/first';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { IAppState } from '@app/core/state/state.interface';
import { IContractorManager, IActionType } from '@app/routes/admin/contractors/contractors-and-portfolios.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { Toolbar, ToolbarItemType } from '@app/shared/components/toolbar/toolbar.interface';

import { ContractorsAndPortfoliosService } from '@app/routes/admin/contractors/contractors-and-portfolios.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';

import { addGridLabel, combineLatestAnd, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-manager-grid',
  templateUrl: './manager-grid.component.html',
})
export class ManagerGridComponent extends DialogFunctions implements OnDestroy, OnInit {
  dialog: string;

  readonly canView$: Observable<boolean> = this.userPermissionsService.has('CONTRACTOR_MANAGER_VIEW');
  readonly canAdd$: Observable<boolean> = this.userPermissionsService.has('CONTRACTOR_MANAGER_ADD');
  readonly canEdit$: Observable<boolean> = this.userPermissionsService.has('CONTRACTOR_MANAGER_EDIT');
  readonly canDelete$: Observable<boolean> = this.userPermissionsService.has('CONTRACTOR_MANAGER_DELETE');

  toolbar: Toolbar = {
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
          this.store.select(state => state.contractorsAndPortfolios.selectedManager).map(o => !!o)
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        action: () => this.setDialog('delete'),
        enabled: combineLatestAnd([
          this.canDelete$,
          this.store.select(state => state.contractorsAndPortfolios.selectedManager).map(o => !!o)
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.fetchAll(),
        enabled: this.canView$
      }
    ]
  };

  columns: ISimpleGridColumn<IContractorManager>[] = [
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
  ].map(addGridLabel('contractors.managers.grid'));

  private contractorId = (<any>this.route.params).value.contractorId;
  private canViewSubscription: Subscription;
  private managersSubscription: Subscription;

  managers: IContractorManager[];
  selection: IContractorManager[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.fetchAll();
      } else {
        this.clearManagers();
        this.notificationsService.permissionError().entity('entities.managers.gen.plural').dispatch();
      }
    });

    this.managersSubscription = this.contractorsAndPortfoliosService.getAction(IActionType.MANAGERS_FETCH)
      .subscribe(() => {
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

  onAdd(): void {
    this.routingService.navigate([ 'create' ], this.route);
  }

  onEdit(): void {
    this.canEdit$
      .pipe(
        first(),
      )
      .subscribe(() => this.routingService.navigate([ String(this.selection[0].id) ], this.route));
  }

  onSelect(managers: IContractorManager[]): void {
    this.selection = managers;
    const manager = isEmpty(managers)
      ? null
      : managers[0];
    this.contractorsAndPortfoliosService.selectManager(manager);
  }

  onBack(): void {
    this.routingService.navigate([ `/app/admin/contractors/${String(this.contractorId)}`
    ]);
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
