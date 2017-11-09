import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,  } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IContractor, IPortfolio } from '../contractors-and-portfolios.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../core/dialog';

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
        this.contractorsAndPortfoliosService.selectedPortfolio$
      ).map(([hasPermissions, selectedPortfolio]) => hasPermissions && !!selectedPortfolio)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_MOVE,
      action: () => this.setDialog('move'),
      enabled: Observable.combineLatest(
        this.canMove$,
        this.contractorsAndPortfoliosService.selectedPortfolio$
      ).map(([hasPermissions, selectedPortfolio]) => hasPermissions && !!selectedPortfolio)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('delete'),
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.contractorsAndPortfoliosService.selectedPortfolio$
      ).map(([hasPermissions, selectedPortfolio]) => hasPermissions && !!selectedPortfolio)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      // TODO
      action: () => this.contractorsAndPortfoliosService.fetchPortfolios(1),
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

  private actionsSubscription: Subscription;
  private canViewSubscription: Subscription;
  private contractorsSubscription: Subscription;
  private portfoliosSubscription: Subscription;

  dialog: string;
  selectedContractor: IContractor;
  selectedPortfolio: IPortfolio;
  portfolios: IPortfolio [];

  constructor(
    private actions: Actions,
    private cdRef: ChangeDetectorRef,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
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

    this.canViewSubscription = Observable.combineLatest(
      this.canView$,
      this.contractorsAndPortfoliosService.selectedContractorId$
    ).subscribe(([canView, selectedContractorId]) => {
      if (canView && selectedContractorId) {
        this.contractorsAndPortfoliosService.fetchPortfolios(selectedContractorId)
          .subscribe((portfolios) => {
            this.portfolios = portfolios;
            this.cdRef.markForCheck();
          });
      } else {
        this.contractorsAndPortfoliosService.clearPortfolios();
        if (!canView) {
          this.notificationsService.error('errors.default.read.403').entity('entities.portfolios.gen.plural').dispatch();
        }
      }
    });

    this.portfoliosSubscription = this.contractorsAndPortfoliosService.selectedPortfolio$
      .subscribe(portfolio => {
        this.selectedPortfolio = portfolio;
      });

    this.actionsSubscription = this.actions
      .ofType(ContractorsAndPortfoliosService.PORTFOLIO_DELETE_SUCCESS, ContractorsAndPortfoliosService.PORTFOLIO_MOVE_SUCCESS)
      .subscribe(() => {
        this.setDialog();
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.contractorsSubscription.unsubscribe();
    this.portfoliosSubscription.unsubscribe();
    this.contractorsAndPortfoliosService.clearPortfolios();
  }

  // get portfolios$(): Observable<IPortfolio[]> {
  //   return this.contractorsAndPortfoliosService.portfolios$;
  // }

  get selectedPortfolio$(): Observable<IPortfolio[]> {
    return this.contractorsAndPortfoliosService.selectedPortfolio$
      .map(portfolio => portfolio ? [portfolio] : []);
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
    this.router.navigate([`/admin/contractors/${this.selectedContractor.id}/portfolios/create`]);
  }

  onEdit(): void {
    this.router.navigate([`/admin/contractors/${this.selectedContractor.id}/portfolios/${this.selectedPortfolio.id}`]);
  }

  onSelect(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.selectPortfolio(portfolio.id);
  }

  onRemoveSubmit(): void {
    this.contractorsAndPortfoliosService.deletePortfolio(this.selectedContractor.id);
  }

  onMoveSubmit(contractor: IContractor): void {
    this.contractorsAndPortfoliosService
        .movePortfolio(this.selectedContractor.id, contractor.id, this.selectedPortfolio.id);
  }

}
