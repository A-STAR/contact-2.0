import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { IAppState } from '@app/core/state/state.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IContextMenuItem } from '@app/shared/components/grid/grid.interface';
import {
  IContractor,
  IPortfolio,
  PortfolioAction,
  IActionType
} from '@app/routes/admin/contractors/contractors-and-portfolios.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '@app/core/utils/helpers';
import { DialogFunctions } from '@app/core/dialog';
import { GridComponent } from '@app/shared/components/grid/grid.component';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfoliosComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  titlebar: ITitlebar = {
    title: 'portfolios.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_ADD,
        action: () => this.onAdd(),
        enabled: combineLatestAnd([
          this.canAdd$,
          this.store.select(state => state.contractorsAndPortfolios.selectedContractor).map(o => !!o),
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_EDIT,
        action: () => this.onEdit(),
        enabled: combineLatestAnd([
          this.canEdit$,
          this.store.select(state => state.contractorsAndPortfolios.selectedContractor).map(o => !!o),
          this.store.select(state => state.contractorsAndPortfolios.selectedPortfolio).map(o => !!o),
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_MOVE,
        action: () => this.onMove(),
        enabled: combineLatestAnd([
          this.canMove$,
          this.store.select(state => state.contractorsAndPortfolios.selectedContractor).map(o => !!o),
          this.store.select(state => state.contractorsAndPortfolios.selectedPortfolio).map(o => !!o),
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_DELETE,
        action: () => this.setDialog('delete'),
        enabled: combineLatestAnd([
          this.canDelete$,
          this.store.select(state => state.contractorsAndPortfolios.selectedContractor).map(o => !!o),
          this.store.select(state => state.contractorsAndPortfolios.selectedPortfolio).map(o => !!o),
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_REFRESH,
        action: () => this.fetchAll().subscribe(portfolios => this.onPortfoliosFetch(portfolios)),
        enabled: this.canView$
      }
    ]
  };

  contextMenuOptions: IContextMenuItem[] = [
    {
      label: this.translateService.instant('portfolios.outsourcing.form.menu'),
      action: () => this.onForm(),
      enabled: combineLatestAnd([
        this.canForm$,
        this.store.select(state => state.contractorsAndPortfolios.selectedContractor).map(o => !!o),
        this.store.select(state => state.contractorsAndPortfolios.selectedPortfolio).map(o => this.canForm(o)),
      ])
    },
    {
      label: this.translateService.instant('portfolios.outsourcing.send.menu.title'),
      enabled: this.canSendOutsource(),
      submenu: [
        {
          label: this.translateService.instant('portfolios.outsourcing.send.menu.outsourcing'),
          action: () => this.onAction('sendOutsource'),
          enabled: this.canSendOutsource(),
        }, {
          label: this.translateService.instant('portfolios.outsourcing.send.menu.cession'),
          action: () => this.onAction('sendCession'),
          enabled: this.canSendOutsource(),
        }
      ]
    },
    {
      label: this.translateService.instant('portfolios.outsourcing.return.menu'),
      action: () => this.onAction('returnOutsource'),
      enabled: combineLatestAnd([
        this.canReturn$,
        this.store.select(state => state.contractorsAndPortfolios.selectedContractor).map(o => !!o),
        this.store.select(state => state.contractorsAndPortfolios.selectedPortfolio).map(o => this.canReturn(o))
      ])
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 50, maxWidth: 50 },
    { prop: 'name', minWidth: 120, maxWidth: 200 },
    { prop: 'directionCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION },
    { prop: 'stageCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE },
    { prop: 'statusCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS },
    { prop: 'signDate', minWidth: 100, maxWidth: 150, renderer: 'dateRenderer' },
    { prop: 'startWorkDate', minWidth: 100, maxWidth: 150, renderer: 'dateRenderer' },
    { prop: 'endWorkDate', minWidth: 100, maxWidth: 150, renderer: 'dateRenderer' },
    { prop: 'comment', minWidth: 100 },
  ];

  dialog: string;
  portfolios: IPortfolio[];
  selectedContractor: IContractor;

  private contractorSubscription: Subscription;
  private portfoliosUpdateSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
    private translateService: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.contractorSubscription = combineLatest(
      this.canView$,
      this.store.select(state => state.contractorsAndPortfolios.selectedContractor)
    )
      .subscribe(([canView, contractor]) => {
        if (canView && contractor) {
          this.selectedContractor = contractor;
          this.fetchAll().subscribe(portfolios => this.onPortfoliosFetch(portfolios));
        } else {
          if (!canView) {
            this.notificationsService.error('errors.default.read.403').entity('entities.portfolios.gen.plural').dispatch();
          }
          this.clearPortfolios();
        }
      });

    this.portfoliosUpdateSub =
        this.contractorsAndPortfoliosService.getAction(IActionType.PORTFOLIO_SAVE)
        .switchMap(() => this.fetchAll())
        .subscribe(portfolios => this.onPortfoliosFetch(portfolios));
  }

  ngOnDestroy(): void {
    if (this.contractorSubscription) {
      this.contractorSubscription.unsubscribe();
    }
    if (this.portfoliosUpdateSub) {
      this.portfoliosUpdateSub.unsubscribe();
    }
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_EDIT');
  }

  get canMove$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_MOVE');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_DELETE');
  }

  get canForm$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_OUTSOURCING_FORM');
  }

  get canSend$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_OUTSOURCING_SEND');
  }

  get canReturn$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_OUTSOURCING_RETURN');
  }

  get selectedPortfolio$(): Observable<IPortfolio> {
    return this.store.select(state => state.contractorsAndPortfolios.selectedPortfolio);
  }

  get selectedContractor$(): Observable<IContractor> {
    return this.store.select(state => state.contractorsAndPortfolios.selectedContractor);
  }

  canSendOutsource(): Observable<boolean> {
    return combineLatestAnd([
      this.canSend$,
      this.store.select(state => state.contractorsAndPortfolios.selectedPortfolio).map(o => this.canSend(o)),
    ]);
  }

  canForm(portfolio: IPortfolio): boolean {
    return portfolio &&
      portfolio.directionCode === 2 && portfolio.statusCode === 4;
  }

  canSend(portfolio: IPortfolio): boolean {
    return portfolio && portfolio.directionCode === 2 && portfolio.statusCode === 5;
  }

  canReturn(portfolio: IPortfolio): boolean {
    return portfolio && portfolio.directionCode === 2 && portfolio.statusCode === 6;
  }

  onAdd(): void {
    this.routingService.navigate([ `${this.selectedContractor.id}/portfolios/create` ], this.route);
  }

  onEdit(): void {
    this.routingService.navigate([ `${this.selectedContractor.id}/portfolios/${this.grid.selected[0].id}` ], this.route);
  }

  onMove(): void {
    this.contractorsAndPortfoliosService.readContractor(this.selectedContractor.id)
      .subscribe(contractor => {
        this.selectedContractor = contractor;
        this.setDialog('move');
        this.cdRef.markForCheck();
      });
  }

  onAction(action: PortfolioAction): void {
    this.setDialog(action);
  }

  onSelect(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.selectPortfolio(portfolio);
  }

  onRemoveSubmit(): void {
    this.contractorsAndPortfoliosService.deletePortfolio(this.selectedContractor.id, this.grid.selected[0].id)
    .switchMap(() => this.fetchAll())
    .subscribe(portfolios => {
      this.setDialog();
      this.onPortfoliosFetch(portfolios);
    });
  }

  onForm(): void {
    this.contractorsAndPortfoliosService
      .formOutsourcePortfolio(this.selectedContractor.id, this.grid.selected[0].id, this.grid.selected[0])
      .switchMap(() => this.fetchAll())
      .subscribe(portfolios => {
        this.setDialog();
        this.onPortfoliosFetch(portfolios);
      });
  }

  onMoveSubmit(contractor: IContractor): void {
    this.contractorsAndPortfoliosService
      .movePortfolio(this.selectedContractor.id, this.grid.selected[0].id, { newContractorId: contractor.id } )
      .switchMap(() => this.fetchAll())
      .subscribe(portfolios => {
        this.setDialog();
        this.onPortfoliosFetch(portfolios);
      });
  }

  onSendOutsourceSubmit(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.sendOutsourcePortfolio(this.selectedContractor.id,
      this.grid.selected[0].id, portfolio)
      .switchMap(() => this.fetchAll())
      .subscribe(portfolios => {
        this.setDialog();
        this.onPortfoliosFetch(portfolios);
      });
  }

  onSendCessionSubmit(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.sendCessionPortfolio(this.selectedContractor.id,
      this.grid.selected[0].id, portfolio)
      .switchMap(() => this.fetchAll())
      .subscribe(portfolios => {
        this.setDialog();
        this.onPortfoliosFetch(portfolios);
      });
  }
  onReturnOutsourceSubmit(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.returnOutsourcePortfolio(this.selectedContractor.id,
      this.grid.selected[0].id, portfolio)
      .switchMap(() => this.fetchAll())
      .subscribe(portfolios => {
        this.setDialog();
        this.onPortfoliosFetch(portfolios);
      });
  }

  private fetchAll(): Observable<IPortfolio[]> {
    return this.contractorsAndPortfoliosService.readPortfolios(this.selectedContractor.id);
  }

  private clearPortfolios(): void {
    this.grid.selected = [];
    this.portfolios = [];
    this.contractorsAndPortfoliosService.selectPortfolio(null);
    this.cdRef.markForCheck();
  }

  private onPortfoliosFetch(portfolios: IPortfolio[]): void {
    this.grid.selected = [];
    this.contractorsAndPortfoliosService.selectPortfolio(null);
    this.portfolios = portfolios;
    this.cdRef.markForCheck();
  }
}
