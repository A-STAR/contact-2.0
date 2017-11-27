import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IContractor, IPortfolio } from '../contractors-and-portfolios.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '../../../../core/utils/helpers';
import { DialogFunctions } from '../../../../core/dialog';
import { GridComponent } from '../../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfoliosComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onAdd(),
      enabled: combineLatestAnd([
        this.canAdd$,
        this.contractorsAndPortfoliosService.selectedContractorId$.map(o => !!o),
        this.contractorsAndPortfoliosService.selectedPortfolioId$.map(o => !!o),
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(),
      enabled: combineLatestAnd([
        this.canEdit$,
        this.contractorsAndPortfoliosService.selectedContractorId$.map(o => !!o),
        this.contractorsAndPortfoliosService.selectedPortfolioId$.map(o => !!o),
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_MOVE,
      action: () => this.toMovePortfolio(),
      enabled: combineLatestAnd([
        this.canMove$,
        this.contractorsAndPortfoliosService.selectedContractorId$.map(o => !!o),
        this.contractorsAndPortfoliosService.selectedPortfolioId$.map(o => !!o),
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('delete'),
      enabled: combineLatestAnd([
        this.canDelete$,
        this.contractorsAndPortfoliosService.selectedContractorId$.map(o => !!o),
        this.contractorsAndPortfoliosService.selectedPortfolioId$.map(o => !!o),
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchAll(),
      enabled: this.canView$
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
  selectedContractor: IContractor;
  selectedContractorId: number;
  selection: IPortfolio[];

  set portfolios(newPortfolios: IPortfolio[]) {
    this._portfolios = newPortfolios;
    this.selection = [];
    this.cdRef.markForCheck();
  }

  get portfolios(): IPortfolio[] {
    return this._portfolios;
  }

  private canViewSubscription: Subscription;
  private contractorSubscription: Subscription;
  private _portfolios: IPortfolio[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
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

    this.canViewSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        // this.selectedContractorId = selectedContractorId;
      } else {
        this.clearPortfolios();
        if (!canView) {
          this.notificationsService.error('errors.default.read.403').entity('entities.portfolios.gen.plural').dispatch();
        }
      }
    });

    this.contractorSubscription = this.contractorsAndPortfoliosService.selectedContractorId$
      .switchMap(contractorId => {
        console.log(contractorId);
        this.selectedContractorId = contractorId;
        return contractorId
          ? this.contractorsAndPortfoliosService.readPortfolios(contractorId)
          : Observable.of([]);
      })
      .subscribe(portfolios => this.portfolios = portfolios);
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.contractorSubscription.unsubscribe();
    // this.needToReadPortfolios$.unsubscribe();
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
    this.contractorsAndPortfoliosService.selectPortfolio(portfolio.id);
  }

  onRemoveSubmit(): void {
    this.contractorsAndPortfoliosService.deletePortfolio(this.selectedContractorId, this.selection[0].id)
      .subscribe(() => {
        this.setDialog();
      });
  }

  onMoveSubmit(contractor: IContractor): void {
    this.contractorsAndPortfoliosService
      .movePortfolio(this.selectedContractorId, this.selection[0].id, { newContractorId: contractor.id } )
      .subscribe(() => {
        this.setDialog();
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

  fetchAll(): void {
    // this.contractorsAndPortfoliosService.readPortfolios()
  }

  private clearPortfolios(): void {
    this.portfolios = null;
  }
}
