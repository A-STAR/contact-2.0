import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IPortfolio } from '../contractors-and-portfolios.interface';
import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContentTabService } from '../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
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

  private renderers: IRenderer = {
    directionCode: [],
    statusCode: [],
    stageCode: []
  };

  private canViewSubscription: Subscription;
  private dictionariesSubscription: Subscription;

  constructor(
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.userDictionariesService.preload([
      UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION,
      UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS,
      UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE,
    ]);

    this.dictionariesSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE)
    ).subscribe(([ directionCodeOptions, statusCodeOptions, stageCodeOptions ]) => {
      this.renderers.directionCode = [].concat(directionCodeOptions);
      this.renderers.statusCode = [].concat(statusCodeOptions);
      this.renderers.stageCode = [].concat(stageCodeOptions);
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    });

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
    this.dictionariesSubscription.unsubscribe();
    this.contractorsAndPortfoliosService.clearPortfolios();
  }

  get isPortfolioBeingRemoved(): boolean {
    return false;
  }

  get portfolios$(): Observable<Array<IPortfolio>> {
    return this.contractorsAndPortfoliosService.portfolios$;
  }

  get selectedPortfolio$(): Observable<IPortfolio> {
    return this.contractorsAndPortfoliosService.selectedPortfolio$;
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
    // TODO(d.maltsev): simplify this
    this.contractorsAndPortfoliosService.selectedContractor$
      .take(1)
      .subscribe(contractor => {
        this.contentTabService.navigate(`/admin/contractors/${contractor.id}/portfolios/${portfolio.id}`);
      });
  }

  onSelect(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.selectPortfolio(portfolio.id);
  }

  onRemoveSubmit(): void {
    console.log('onRemoveSubmit');
  }

  onCancel(): void {
    console.log('onCancel');
  }
}
