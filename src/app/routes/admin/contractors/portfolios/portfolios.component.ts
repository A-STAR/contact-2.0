import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,  } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IContractor, IPortfolio } from '../contractors-and-portfolios.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../core/dialog';
import { MessageBusService } from '../../../../core/message-bus/message-bus.service';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfoliosComponent extends DialogFunctions implements OnDestroy {
  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onAdd(),
      enabled: Observable.combineLatest(
        this.canAdd$,
        this.contractorsAndPortfoliosService.selectedContractorId$
      ).map(([hasPermissions, selectedContractorId]) => hasPermissions && !!selectedContractorId)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.contractorsAndPortfoliosService.selectedContractorId$,
        this.contractorsAndPortfoliosService.mapContractorToSelectedPortfolio$
      ).map(([hasPermissions, selectedContractorId, mapContractorToSelectedPortfolio]) =>
                  hasPermissions && mapContractorToSelectedPortfolio && selectedContractorId
                  && !!mapContractorToSelectedPortfolio[selectedContractorId])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_MOVE,
      action: () => this.toMovePortfolio(),
      enabled: Observable.combineLatest(
        this.canMove$,
        this.contractorsAndPortfoliosService.selectedContractorId$,
        this.contractorsAndPortfoliosService.mapContractorToSelectedPortfolio$
      ).map(([hasPermissions, selectedContractorId, mapContractorToSelectedPortfolio]) =>
                  hasPermissions && mapContractorToSelectedPortfolio && selectedContractorId
                  && !!mapContractorToSelectedPortfolio[selectedContractorId])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('delete'),
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.contractorsAndPortfoliosService.selectedContractorId$,
        this.contractorsAndPortfoliosService.mapContractorToSelectedPortfolio$
      ).map(([hasPermissions, selectedContractorId, mapContractorToSelectedPortfolio]) =>
                  hasPermissions && mapContractorToSelectedPortfolio && selectedContractorId
                  && !!mapContractorToSelectedPortfolio[selectedContractorId])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.needToReadPortfolios$.next(' '),
      enabled: Observable.combineLatest(
        this.canView$,
        this.contractorsAndPortfoliosService.selectedContractorId$
      ).map(([hasPermissions, selectedContractorId]) => hasPermissions && !!selectedContractorId)
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
    { prop: 'comment', minWidth: 100, maxWidth: 250 },
  ];


  dialog: string;
  selectedContractor: IContractor;
  selectedContractorId: number;
  selection: IPortfolio[];

  set portfolios(newPortfolios: IPortfolio[]) {
    // TODO refactor this function
    if (!newPortfolios) {
      this._portfolios = null;
      return;
    }
    if (!newPortfolios.length) {
      this.messageBusService.dispatch(
        ContractorsAndPortfoliosService.EMPTY_MANAGERS_FOR_CONTRACTOR_DETECTED,
        null,
        this.selectedContractorId);
    }

    this._portfolios = newPortfolios;

    if (!(this.contractorsAndPortfoliosService.portfolioMapping
          && this.contractorsAndPortfoliosService.portfolioMapping[this.selectedContractorId])) {
      return;
    }

    this.selection = this.portfolios.find(portfolio => portfolio.id ===
      this.contractorsAndPortfoliosService.portfolioMapping[this.selectedContractorId])
      ? [this.portfolios.find(portfolio => portfolio.id ===
        this.contractorsAndPortfoliosService.portfolioMapping[this.selectedContractorId])]
      : [];
  }

  get portfolios(): IPortfolio[] {
    return this._portfolios;
  }

  private needToReadPortfolios$ = new BehaviorSubject<string>(null);
  private actionsSubscription: Subscription;
  private canViewSubscription: Subscription;
  private contractorSubscription: Subscription;
  private _portfolios: IPortfolio[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private messageBusService: MessageBusService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
    this.gridService.setDictionaryRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = this.gridService.setRenderers(columns);
        this.cdRef.markForCheck();
      });

    this.needToReadPortfolios$
      .filter(Boolean)
      .flatMap(() => this.contractorsAndPortfoliosService.readPortfolios(this.selectedContractorId))
      .subscribe((portfolios) => {
        this.portfolios = portfolios as IPortfolio[];
        this.cdRef.markForCheck();
      });

    this.canViewSubscription = Observable.combineLatest(
      this.canView$,
      this.contractorsAndPortfoliosService.selectedContractorId$
    ).subscribe(([canView, selectedContractorId]) => {
      if (canView && selectedContractorId) {
        this.selectedContractorId = selectedContractorId;
        this.needToReadPortfolios$.next(' ');
      } else {
        this.clearPortfolios();
        if (!canView) {
          this.notificationsService.error('errors.default.read.403').entity('entities.portfolios.gen.plural').dispatch();
        }
      }
    });

    this.messageBusService
      .select(ContractorsAndPortfoliosService.PORTFOLIOS_FETCH)
      .subscribe(() => {
        this.needToReadPortfolios$.next(' ');
      });

    this.contractorSubscription = this.contractorsAndPortfoliosService.selectedContractorId$
      .subscribe(contractorId => this.selectedContractorId = contractorId);
 }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.contractorSubscription.unsubscribe();
    this.needToReadPortfolios$.unsubscribe();
    this.clearPortfolios();
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

  onAdd(): void {
    this.router.navigate([`/admin/contractors/${this.selectedContractorId}/portfolios/create`]);
  }

  onEdit(): void {
    this.router.navigate([`/admin/contractors/${this.selectedContractorId}/portfolios/${this.selection[0].id}`]);
  }

  onSelect(portfolio: IPortfolio): void {
    this.selection = [portfolio];
    this.contractorsAndPortfoliosService.selectPortfolio(this.selectedContractorId, portfolio.id);
  }

  onRemoveSubmit(): void {
    this.contractorsAndPortfoliosService.deletePortfolio(this.selectedContractorId, this.selection[0].id)
        .subscribe(() => {
          this.setDialog();
          this.needToReadPortfolios$.next(' ');
        });
  }

  onMoveSubmit(contractor: IContractor): void {
    this.contractorsAndPortfoliosService
      .movePortfolio(this.selectedContractorId, this.selection[0].id, { newContractorId: contractor.id } )
      .subscribe(() => {
        this.setDialog();
        this.needToReadPortfolios$.next(' ');
      });
  }

  toMovePortfolio(): void {
    this.contractorsAndPortfoliosService.readContractor(this.selectedContractorId)
    .subscribe(contractor => {
        this.selectedContractor = contractor;
        this.setDialog('move');
        this.cdRef.markForCheck();
      });
  }

  private clearPortfolios(): void {
    this.portfolios = null;
  }
}
