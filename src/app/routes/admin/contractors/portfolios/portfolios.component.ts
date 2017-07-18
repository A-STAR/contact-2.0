import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IContractor, IPortfolio } from '../contractors-and-portfolios.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';
import { PortfolioActionEnum } from './portfolios.interface';

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
      action: () => this.onAdd(),
      enabled: Observable.combineLatest(
        this.canAdd$,
        this.contractorsAndPortfoliosService.selectedContractor$
      ).map(([hasPermissions, selectedContractor]) => hasPermissions && !!selectedContractor)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.contractorsAndPortfoliosService.selectedPortfolio$
      ).map(([hasPermissions, selectedPortfolio]) => hasPermissions && !!selectedPortfolio)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_MOVE,
      action: () => this.dialogAction$.next(PortfolioActionEnum.MOVE),
      enabled: Observable.combineLatest(
        this.canMove$,
        this.contractorsAndPortfoliosService.selectedPortfolio$
      ).map(([hasPermissions, selectedPortfolio]) => hasPermissions && !!selectedPortfolio)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dialogAction$.next(PortfolioActionEnum.DELETE),
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

  private dialogAction$ = new BehaviorSubject<PortfolioActionEnum>(null);

  private actionsSubscription: Subscription;
  private canViewSubscription: Subscription;
  private contractorsSubscription: Subscription;
  private dictionariesSubscription: Subscription;
  private portfoliosSubscription: Subscription;

  private selectedContractor: IContractor;
  private selectedPortfolio: IPortfolio;

  constructor(
    private actions: Actions,
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

    this.contractorsSubscription = this.contractorsAndPortfoliosService.selectedContractor$.subscribe(contractor => {
      this.selectedContractor = contractor;
    });

    this.portfoliosSubscription = this.contractorsAndPortfoliosService.selectedPortfolio$.subscribe(portfolio => {
      this.selectedPortfolio = portfolio;
    });

    this.actionsSubscription = this.actions
      .ofType(ContractorsAndPortfoliosService.PORTFOLIO_DELETE_SUCCESS, ContractorsAndPortfoliosService.PORTFOLIO_MOVE_SUCCESS)
      .subscribe(() => {
        this.dialogAction$.next(null);
      });
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.contractorsSubscription.unsubscribe();
    this.dictionariesSubscription.unsubscribe();
    this.portfoliosSubscription.unsubscribe();
    this.contractorsAndPortfoliosService.clearPortfolios();
  }

  get isPortfolioBeingMoved$(): Observable<boolean> {
    return this.dialogAction$.map(value => value === PortfolioActionEnum.MOVE);
  }

  get isPortfolioBeingDeleted$(): Observable<boolean> {
    return this.dialogAction$.map(value => value === PortfolioActionEnum.DELETE);
  }

  get portfolios$(): Observable<Array<IPortfolio>> {
    return this.contractorsAndPortfoliosService.portfolios$;
  }

  get selectedPortfolio$(): Observable<IPortfolio> {
    return this.contractorsAndPortfoliosService.selectedPortfolio$;
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_VIEW').filter(permission => permission !== undefined);
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_ADD').filter(permission => permission !== undefined);
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_EDIT').filter(permission => permission !== undefined);
  }

  get canMove$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_MOVE').filter(permission => permission !== undefined);
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_DELETE').filter(permission => permission !== undefined);
  }

  onAdd(): void {
    this.contentTabService.navigate(`/admin/contractors/${this.selectedContractor.id}/portfolios/create`);
  }

  onEdit(): void {
    this.contentTabService.navigate(`/admin/contractors/${this.selectedContractor.id}/portfolios/${this.selectedPortfolio.id}`);
  }

  onSelect(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.selectPortfolio(portfolio.id);
  }

  onRemoveSubmit(): void {
    this.contractorsAndPortfoliosService.deletePortfolio(this.selectedContractor.id);
  }

  onMoveSubmit(contractor: IContractor): void {
    this.contractorsAndPortfoliosService.movePortfolio(this.selectedContractor.id, contractor.id, this.selectedPortfolio.id);
  }

  onCloseDialog(): void {
    this.dialogAction$.next(null);
  }
}
