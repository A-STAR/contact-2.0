import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IContextMenuItem } from '../../../../shared/components/grid/grid.interface';
import { IContractor, IPortfolio } from '../contractors-and-portfolios.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContractorsAndPortfoliosService } from '../contractors-and-portfolios.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { GridComponent } from '../../../../shared/components/grid/grid.component';

import { combineLatestAnd } from '../../../../core/utils/helpers';
import { DialogFunctions } from '../../../../core/dialog';

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
      action: () => this.onMove(),
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

  contextMenuOptions: IContextMenuItem[] = [
    {
      label: this.translateService.instant('portfolios.outsourcing.form.menu'),
      action: () => this.onForm(),
      enabled: combineLatestAnd([
        this.canForm$,
        this.contractorsAndPortfoliosService.selectedContractorId$.map(o => !!o),
        this.contractorsAndPortfoliosService.selectedPortfolioId$.map(o => !!o),
        Observable.of(this.isPortfolioCanForm)
      ])
    },
    {
      label: this.translateService.instant('portfolios.outsourcing.send.menu'),
      action: () => this.onForm(),
      enabled: combineLatestAnd([
        this.canSend$,
        this.contractorsAndPortfoliosService.selectedContractorId$.map(o => !!o),
        this.contractorsAndPortfoliosService.selectedPortfolioId$.map(o => !!o),
        Observable.of(this.isPortfolioCanSend)
      ])
    },
    {
      label: this.translateService.instant('portfolios.outsourcing.return.menu'),
      action: () => this.onForm(),
      enabled: combineLatestAnd([
        this.canReturn$,
        this.contractorsAndPortfoliosService.selectedContractorId$.map(o => !!o),
        this.contractorsAndPortfoliosService.selectedPortfolioId$.map(o => !!o),
        Observable.of(this.isPortfolioCanReturn)
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
  selectedContractorId: number;
  selection: IPortfolio[];

  private contractorSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private router: Router,
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

    this.contractorSubscription = Observable.combineLatest(
      this.canView$,
      this.contractorsAndPortfoliosService.selectedContractorId$.filter(Boolean)
    )
    .subscribe(([canView, contractorId]) => {
      if (canView) {
        this.selectedContractorId = contractorId;
        this.fetchAll();
      } else {
        this.clearPortfolios();
        this.notificationsService.error('errors.default.read.403').entity('entities.portfolios.gen.plural').dispatch();
      }
    });
  }

  ngOnDestroy(): void {
    this.contractorSubscription.unsubscribe();
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

  get isPortfolioCanForm(): boolean {
    const selectedPortfolio = this.selection && this.selection[0];
    return selectedPortfolio && selectedPortfolio.directionCode === 2 && selectedPortfolio.statusCode === 4;
  }

  get isPortfolioCanSend(): boolean {
    const selectedPortfolio = this.selection && this.selection[0];
    return selectedPortfolio && selectedPortfolio.directionCode === 2 && selectedPortfolio.statusCode === 5;
  }

  get isPortfolioCanReturn(): boolean {
    const selectedPortfolio = this.selection && this.selection[0];
    return selectedPortfolio && selectedPortfolio.directionCode === 2 && selectedPortfolio.statusCode === 6;
  }

  onAdd(): void {
    this.router.navigate([`/admin/contractors/${this.selectedContractorId}/portfolios/create`]);
  }

  onEdit(): void {
    this.router.navigate([`/admin/contractors/${this.selectedContractorId}/portfolios/${this.selection[0].id}`]);
  }

  onMove(): void {
    this.contractorsAndPortfoliosService.readContractor(this.selectedContractorId)
      .subscribe(contractor => {
        this.selectedContractor = contractor;
        this.setDialog('move');
        this.cdRef.markForCheck();
      });
  }

  onForm(): void {
    this.contractorsAndPortfoliosService
      .formOutsourcePortfolio(this.selectedContractorId, this.selection[0].id, this.selection[0])
      .subscribe(() => {});
  }

  onSend(): void {
    this.setDialog('send');
  }

  onReturn(): void {
    this.setDialog('return');
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

  onSendSubmit(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.sendOutsourcePortfolio(this.selectedContractorId,
      this.selection[0].id, portfolio)
      .subscribe(() => {
        this.setDialog();
      });
  }

  onReturnSubmit(portfolio: IPortfolio): void {
    this.contractorsAndPortfoliosService.returnOutsourcePortfolio(this.selectedContractorId,
      this.selection[0].id, portfolio)
      .subscribe(() => {
        this.setDialog();
      });
  }

  private fetchAll(): void {
    this.contractorsAndPortfoliosService.readPortfolios(this.selectedContractorId)
      .subscribe(portfolios => {
        this.selection = [];
        this.portfolios = portfolios;
        this.cdRef.detectChanges();
      });
  }

  private clearPortfolios(): void {
    this.selection = [];
    this.portfolios = [];
    this.contractorsAndPortfoliosService.selectPortfolio(null);
    this.cdRef.markForCheck();
  }
}
