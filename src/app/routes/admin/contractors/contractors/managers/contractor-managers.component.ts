import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IContractorManager } from '../../contractors-and-portfolios.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

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
      action: () => console.log('MANAGER_ADD'),
      enabled: this.canAdd$
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => console.log('MANAGER_EDIT'),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.contractorsAndPortfoliosService.selectedManager$
      ).map(([hasPermissions, selectedManager]) => hasPermissions && !!selectedManager)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => console.log('MANAGER_DELETE'),
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
    { prop: 'lastName' },
    { prop: 'middleName' },
    { prop: 'firstName' },
    { prop: 'genderCode' },
    { prop: 'position' },
    { prop: 'branchCode' },
    { prop: 'mobPhone' },
    { prop: 'workPhone' },
    { prop: 'intPhone' },
    { prop: 'workAddress' },
    { prop: 'comment' },
  ];

  private contractorId = Number((this.activatedRoute.params as any).value.id);
  private canViewSubscription: Subscription;
  private dictionariesSubscription: Subscription;

  private renderers: IRenderer = {
    genderCode: []
  };

  constructor(
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
        this.notificationsService.error('contractors.managers.messages.accessDenied');
      }
    });

    this.dictionariesSubscription = this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_GENDER)
      .subscribe(options => {
        this.renderers.genderCode = [].concat(options);
        this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      });
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.dictionariesSubscription.unsubscribe();
    this.contractorsAndPortfoliosService.clearManagers();
  }

  get managers$(): Observable<Array<IContractorManager>> {
    return this.contractorsAndPortfoliosService.managers$;
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

  onEdit(manager: IContractorManager): void {
    this.contentTabService.navigate(`/admin/contractors/${this.contractorId}/managers/${manager.id}`);
  }

  onSelect(manager: IContractorManager): void {
    this.contractorsAndPortfoliosService.selectManager(manager.id);
  }

  onClose(): void {
    this.contentTabService.navigate(`/admin/contractors/${this.contractorId}`);
  }
}
