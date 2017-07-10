import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPortfolio } from '../contractors-and-portfolios.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfoliosComponent {
  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => console.log('PORTFOLIO_ADD'),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('PORTFOLIO_ADD'),
        this.contractorsAndPortfoliosService.selectedContractor$
      ).map(([hasPermissions, selectedContractor]) => hasPermissions && !!selectedContractor)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => console.log('PORTFOLIO_EDIT'),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('PORTFOLIO_EDIT'),
        this.contractorsAndPortfoliosService.selectedPortfolio$
      ).map(([hasPermissions, selectedPortfolio]) => hasPermissions && !!selectedPortfolio)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => console.log('PORTFOLIO_DELETE'),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('PORTFOLIO_DELETE'),
        this.contractorsAndPortfoliosService.selectedPortfolio$
      ).map(([hasPermissions, selectedPortfolio]) => hasPermissions && !!selectedPortfolio)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.contractorsAndPortfoliosService.fetchPortfolios(),
      enabled: this.contractorsAndPortfoliosService.selectedContractor$.map(Boolean)
      // TODO(d.maltsev): double check portfolio view permission
      // enabled: this.userPermissionsService.has('???')
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

  canEdit$: Observable<boolean>;
  portfolios$: Observable<Array<IPortfolio>> = Observable.of([]);

  constructor(
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.canEdit$ = this.userPermissionsService.has('PORTFOLIO_EDIT');
  }

  onEdit(portfolio: IPortfolio): void {
    // TODO(d.maltsev)
  }

  onSelect(portfolio: IPortfolio): void {
    // TODO(d.maltsev)
  }
}
