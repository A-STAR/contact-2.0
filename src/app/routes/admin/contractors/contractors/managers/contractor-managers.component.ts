import { Component, OnDestroy } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IContractorManager } from '../../contractors-and-portfolios.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';
import { ContractorManagerActionEnum } from './contractor-managers.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-contractor-managers',
  templateUrl: './contractor-managers.component.html'
})
export class ContractorManagersComponent implements OnDestroy {
  static COMPONENT_NAME = 'ContractorManagersComponent';

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onAdd(),
      enabled: this.canAdd$
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.contractorsAndPortfoliosService.selectedManager$
      ).map(([hasPermissions, selectedManager]) => hasPermissions && !!selectedManager)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dialogAction = ContractorManagerActionEnum.DELETE,
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.contractorsAndPortfoliosService.selectedManager$
      ).map(([hasPermissions, selectedManager]) => hasPermissions && !!selectedManager)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.contractorsAndPortfoliosService.fetchManagers(this.contractorId),
      enabled: this.canView$
    }
  ];

  columns: Array<IGridColumn> = [
    // { prop: 'fullName' },
    { prop: 'lastName', minWidth: 120, maxWidth: 200 },
    { prop: 'firstName', minWidth: 120, maxWidth: 200 },
    { prop: 'middleName', minWidth: 120, maxWidth: 200 },
    { prop: 'genderCode', minWidth: 100, maxWidth: 150 },
    { prop: 'position', minWidth: 100, maxWidth: 150 },
    { prop: 'branchCode', minWidth: 100, maxWidth: 150 },
    { prop: 'mobPhone', minWidth: 100, maxWidth: 150 },
    { prop: 'workPhone', minWidth: 100, maxWidth: 150 },
    { prop: 'intPhone', minWidth: 100, maxWidth: 150 },
    { prop: 'workAddress', minWidth: 100, maxWidth: 250 },
    { prop: 'email', minWidth: 100, maxWidth: 200 },
    { prop: 'comment', minWidth: 100, maxWidth: 250 },
  ];

  private contractorId = Number((this.activatedRoute.params as any).value.id);
  private canViewSubscription: Subscription;
  private dialogAction: ContractorManagerActionEnum;
  private dictionariesSubscription: Subscription;
  private managersSubscription: Subscription;
  private actionsSubscription: Subscription;

  private selectedManager: IContractorManager;

  private renderers: IRenderer = {
    branchCode: [],
    genderCode: []
  };

  constructor(
    private actions: Actions,
    private activatedRoute: ActivatedRoute,
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.contractorsAndPortfoliosService.fetchManagers(this.contractorId);
      } else {
        this.contractorsAndPortfoliosService.clearManagers();
        this.notificationsService.error('errors.default.read.403').entity('entities.managers.gen.plural').dispatch();
      }
    });

    this.dictionariesSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_BRANCHES),
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_GENDER)
    ).subscribe(([ branchOptions, genderOptions ]) => {
      this.renderers.branchCode = [].concat(branchOptions);
      this.renderers.genderCode = [].concat(genderOptions);
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    });

    this.managersSubscription = this.contractorsAndPortfoliosService.selectedManager$.subscribe(manager => {
      this.selectedManager = manager;
    });

    this.actionsSubscription = this.actions
      .ofType(ContractorsAndPortfoliosService.MANAGER_DELETE_SUCCESS)
      .subscribe(() => this.dialogAction = null);
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.dictionariesSubscription.unsubscribe();
    this.contractorsAndPortfoliosService.clearManagers();
  }

  get isManagerBeingRemoved(): boolean {
    return this.dialogAction === ContractorManagerActionEnum.DELETE;
  }

  get managers$(): Observable<Array<IContractorManager>> {
    return this.contractorsAndPortfoliosService.managers$;
  }

  get selectedManager$(): Observable<IContractorManager> {
    return this.contractorsAndPortfoliosService.selectedManager$;
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_VIEW').filter(permission => permission !== undefined);
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_ADD').filter(permission => permission !== undefined);
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_EDIT').filter(permission => permission !== undefined);
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTRACTOR_MANAGER_DELETE').filter(permission => permission !== undefined);
  }

  onAdd(): void {
    this.contentTabService.navigate(`/admin/contractors/${this.contractorId}/managers/create`);
  }

  onEdit(): void {
    this.contentTabService.navigate(`/admin/contractors/${this.contractorId}/managers/${this.selectedManager.id}`);
  }

  onSelect(manager: IContractorManager): void {
    this.contractorsAndPortfoliosService.selectManager(manager.id);
  }

  onBack(): void {
    this.contentTabService.navigate(`/admin/contractors/${this.contractorId}`);
  }

  onRemoveSubmit(): void {
    this.contractorsAndPortfoliosService.deleteManager(this.contractorId);
  }

  onCloseDialog(): void {
    this.dialogAction = null;
  }
}
