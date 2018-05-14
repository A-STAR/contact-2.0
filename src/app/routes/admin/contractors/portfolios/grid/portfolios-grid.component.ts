import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { IActionGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IAppState } from '@app/core/state/state.interface';
import {
  IContractor,
  IPortfolio,
  IActionType
} from '@app/routes/admin/contractors/contractors-and-portfolios.interface';
import { IMetadataAction } from '@app/core/metadata/metadata.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { ContractorsAndPortfoliosService } from '@app/routes/admin/contractors/contractors-and-portfolios.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';
import { DateRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';
import { combineLatestAnd } from '@app/core/utils/helpers';
import { DialogFunctions } from '@app/core/dialog';
import { ValueBag } from '@app/core/value-bag/value-bag';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-portfolios-grid',
  templateUrl: './portfolios-grid.component.html',
})
export class PortfoliosGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IPortfolio>;

  readonly canView$: Observable<boolean> = this.userPermissionsService.has('PORTFOLIO_VIEW');
  readonly canAdd$: Observable<boolean> = this.userPermissionsService.has('PORTFOLIO_ADD');
  readonly canEdit$: Observable<boolean> = this.userPermissionsService.has('PORTFOLIO_EDIT');
  readonly canMove$: Observable<boolean> = this.userPermissionsService.has('PORTFOLIO_MOVE');
  readonly canDelete$: Observable<boolean> = this.userPermissionsService.has('PORTFOLIO_DELETE');
  readonly selectedPortfolio$: Observable<IPortfolio> =
    this.store.select(state => state.contractorsAndPortfolios.selectedPortfolio);
  readonly selectedContractor$: Observable<IContractor> =
    this.store.select(state => state.contractorsAndPortfolios.selectedContractor);

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

  actions: IMetadataAction[] = [
    {
      action: 'formOutsourcing',
      label: 'portfolios.outsourcing',
      params: [ 'id' ],
      applyTo: {
        selected: true
      },
      enabled: (_, __, portfolio) => this.canFormPortfolio(portfolio)
    },
    {
      action: 'sendOutsourcing',
      label: 'portfolios.outsourcing.send',
      enabled: (_, __, portfolio) => this.canSendPortfolio(portfolio),
      children: [
        {
          action: 'sendOutsource',
          label: 'portfolios.outsourcing.send',
          params: [ 'id' ],
          applyTo: {
            selected: true
          },
          enabled: (_, __, portfolio) => this.canSendPortfolio(portfolio),
        }, {
          action: 'sendCession',
          label: 'portfolios.outsourcing.send',
          params: [ 'id' ],
          applyTo: {
            selected: true
          },
          enabled: (_, __, portfolio) => this.canSendPortfolio(portfolio),
        }
      ]
    },
    {
      action: 'returnOutsource',
      label: 'portfolios.outsourcing.return',
      params: [ 'id' ],
      applyTo: {
        selected: true
      },
      enabled: (_, __, portfolio) => this.canReturnPortfolio(portfolio),
    }
  ];

  columns: ISimpleGridColumn<IPortfolio>[] = [
    { prop: 'id', minWidth: 50, maxWidth: 50 },
    { prop: 'name', minWidth: 120, maxWidth: 200 },
    { prop: 'directionCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION },
    { prop: 'stageCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE },
    { prop: 'statusCode', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS },
    { prop: 'signDate', minWidth: 100, maxWidth: 150, renderer: DateRendererComponent },
    { prop: 'startWorkDate', minWidth: 100, maxWidth: 150, renderer: DateRendererComponent },
    { prop: 'endWorkDate', minWidth: 100, maxWidth: 150, renderer: DateRendererComponent },
    { prop: 'comment', minWidth: 100 },
  ].map(addGridLabel('portfolios.grid'));

  dialog: string;
  portfolios: IPortfolio[];
  selectedContractor: IContractor;
  selectedPortfolio: IPortfolio;

  private permissions: ValueBag;
  private contractorSubscription: Subscription;
  private portfoliosUpdateSub: Subscription;
  private userPermsSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {

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
            this.notificationsService.permissionError().entity('entities.portfolios.gen.plural').dispatch();
          }
          this.clearPortfolios();
        }
      });

    this.portfoliosUpdateSub =
        this.contractorsAndPortfoliosService.getAction(IActionType.PORTFOLIO_SAVE)
        .switchMap(() => this.fetchAll())
        .subscribe(portfolios => this.onPortfoliosFetch(portfolios));

    this.userPermsSub = this.userPermissionsService.bag()
      .subscribe(bag => {
        this.permissions = bag;
      });
  }

  ngOnDestroy(): void {
    if (this.contractorSubscription) {
      this.contractorSubscription.unsubscribe();
    }
    if (this.portfoliosUpdateSub) {
      this.portfoliosUpdateSub.unsubscribe();
    }
    if (this.userPermsSub) {
      this.userPermsSub.unsubscribe();
    }
  }

  get canView(): boolean {
    return this.permissions.has('PORTFOLIO_VIEW');
  }

  get canAdd(): boolean {
    return this.permissions.has('PORTFOLIO_ADD');
  }

  get canEdit(): boolean {
    return this.permissions.has('PORTFOLIO_EDIT');
  }

  get canMove(): boolean {
    return this.permissions.has('PORTFOLIO_MOVE');
  }

  get canDelete(): boolean {
    return this.permissions.has('PORTFOLIO_DELETE');
  }

  get canForm(): boolean {
    return this.permissions.has('PORTFOLIO_OUTSOURCING_FORM');
  }

  get canSend(): boolean {
    return this.permissions.has('PORTFOLIO_OUTSOURCING_SEND');
  }

  get canReturn(): boolean {
    return this.permissions.has('PORTFOLIO_OUTSOURCING_RETURN');
  }

  canFormPortfolio(portfolio: IPortfolio): boolean {
    return this.canForm && portfolio &&
      portfolio.directionCode === 2 && portfolio.statusCode === 4;
  }

  canSendPortfolio(portfolio: IPortfolio): boolean {
    return this.canSend && portfolio && portfolio.directionCode === 2 && portfolio.statusCode === 5;
  }

  canReturnPortfolio(portfolio: IPortfolio): boolean {
    return this.canReturn && portfolio && portfolio.directionCode === 2 && portfolio.statusCode === 6;
  }

  onAdd(): void {
    this.routingService.navigate([ `${this.selectedContractor.id}/portfolios/create` ], this.route);
  }

  onEdit(): void {
    this.routingService.navigate([ `${this.selectedContractor.id}/portfolios/${this.selectedPortfolio.id}` ], this.route);
  }

  onMove(): void {
    this.contractorsAndPortfoliosService.readContractor(this.selectedContractor.id)
      .subscribe(contractor => {
        this.selectedContractor = contractor;
        this.setDialog('moveOutsource');
        this.cdRef.markForCheck();
      });
  }

  onAction(action: IActionGridAction): void {
    switch (action.metadataAction.action) {
      case 'formOutsourcing':
        this.onForm(action.selection);
        break;
      case 'sendOutsource':
      case 'sendCession':
      case 'returnOutsource':
        this.selectedPortfolio = action.selection;
        this.setDialog(action.metadataAction.action);
        break;
      default:
        throw new Error('Unknown grid action!');
    }
  }

  onSelect(portfolios: IPortfolio[]): void {
    this.selectedPortfolio = portfolios[0];
    this.contractorsAndPortfoliosService.selectPortfolio(portfolios[0]);
  }

  onRemoveSubmit(): void {
    this.contractorsAndPortfoliosService.deletePortfolio(this.selectedContractor.id, this.selectedPortfolio.id)
    .switchMap(() => this.fetchAll())
    .subscribe(portfolios => {
      this.setDialog();
      this.onPortfoliosFetch(portfolios);
    });
  }

  onForm(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService
      .formOutsourcePortfolio(this.selectedContractor.id, portfolio.id, portfolio)
      .switchMap(() => this.fetchAll())
      .subscribe(portfolios => {
        this.setDialog();
        this.onPortfoliosFetch(portfolios);
      });
  }

  onMoveSubmit(contractor: IContractor): void {
    this.contractorsAndPortfoliosService
      .movePortfolio(this.selectedContractor.id, this.selectedPortfolio.id, { newContractorId: contractor.id } )
      .switchMap(() => this.fetchAll())
      .subscribe(portfolios => {
        this.setDialog();
        this.onPortfoliosFetch(portfolios);
      });
  }

  onSendOutsourceSubmit(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.sendOutsourcePortfolio(this.selectedContractor.id,
      this.selectedPortfolio.id, portfolio)
      .switchMap(() => this.fetchAll())
      .subscribe(portfolios => {
        this.setDialog();
        this.onPortfoliosFetch(portfolios);
      });
  }

  onSendCessionSubmit(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.sendCessionPortfolio(this.selectedContractor.id,
      this.selectedPortfolio.id, portfolio)
      .switchMap(() => this.fetchAll())
      .subscribe(portfolios => {
        this.setDialog();
        this.onPortfoliosFetch(portfolios);
      });
  }
  onReturnOutsourceSubmit(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.returnOutsourcePortfolio(this.selectedContractor.id,
      this.selectedPortfolio.id, portfolio)
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
    if (this.grid) {
      this.grid.deselectAll();
    }
    this.portfolios = [];
    this.contractorsAndPortfoliosService.selectPortfolio(null);
    this.cdRef.markForCheck();
  }

  private onPortfoliosFetch(portfolios: IPortfolio[]): void {
    if (this.grid) {
      this.grid.deselectAll();
    }
    this.contractorsAndPortfoliosService.selectPortfolio(null);
    this.portfolios = portfolios;
    this.cdRef.markForCheck();
  }
}
