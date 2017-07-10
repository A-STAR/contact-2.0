import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IPortfolio } from '../contractors-and-portfolios.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfoliosComponent implements OnDestroy {
  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => console.log('PORTFOLIO_ADD'),
      enabled: Observable.combineLatest(
        this.canAdd$,
        this.contractorsAndPortfoliosService.selectedContractor$
      ).map(([hasPermissions, selectedContractor]) => hasPermissions && !!selectedContractor)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => console.log('PORTFOLIO_EDIT'),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.contractorsAndPortfoliosService.selectedPortfolio$
      ).map(([hasPermissions, selectedPortfolio]) => hasPermissions && !!selectedPortfolio)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => console.log('PORTFOLIO_DELETE'),
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.contractorsAndPortfoliosService.selectedPortfolio$
      ).map(([hasPermissions, selectedPortfolio]) => hasPermissions && !!selectedPortfolio)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.contractorsAndPortfoliosService.fetchPortfolios(),
      enabled: Observable.combineLatest(
        this.canView$,
        this.contractorsAndPortfoliosService.selectedContractor$
      ).map(([hasPermissions, selectedContractor]) => hasPermissions && !!selectedContractor)
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'name' },
    { prop: 'directionCode' },
    { prop: 'stageCode' },
    { prop: 'statusCode' },
    { prop: 'signDate' },
    { prop: 'startWorkDate' },
    { prop: 'endWorkDate' },
    { prop: 'comment' },
  ];

  private canViewSubscription: Subscription;

  constructor(
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.canViewSubscription = Observable.combineLatest(
      this.canView$,
      this.contractorsAndPortfoliosService.selectedContractor$
    ).subscribe(([canView, selectedContractor]) => {
      if (canView && selectedContractor) {
        this.contractorsAndPortfoliosService.fetchPortfolios();
      } else {
        this.contractorsAndPortfoliosService.clearPortfolios();
        if (!canView) {
          this.notificationsService.error('portfolios.messages.accessDenied');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.contractorsAndPortfoliosService.clearPortfolios();
  }

  get portfolios$(): Observable<Array<IPortfolio>> {
    return this.contractorsAndPortfoliosService.portfolios$;
  }

  get canView$(): Observable<boolean> {
    // TODO(d.maltsev): double check portfolio view permission
    return this.userPermissionsService.has('PORTFOLIO_VIEW').filter(permission => permission !== undefined);
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_ADD').filter(permission => permission !== undefined);
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_EDIT').filter(permission => permission !== undefined);
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_DELETE').filter(permission => permission !== undefined);
  }

  onEdit(portfolio: IPortfolio): void {
    // TODO(d.maltsev)
  }

  onSelect(portfolio: IPortfolio): void {
    // TODO(d.maltsev)
  }
}
