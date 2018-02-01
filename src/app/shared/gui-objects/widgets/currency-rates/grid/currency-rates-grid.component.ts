import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { ICurrencyRate, IActionType } from '../currency-rates.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { CurrencyRatesService } from '../currency-rates.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { combineLatestAnd } from '@app/core/utils/helpers';

@Component({
  selector: 'app-currency-rates-grid',
  templateUrl: './currency-rates-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyRatesGridComponent implements OnInit, OnDestroy {

  @Input() currencyId$: Observable<number>;

  private currencyId: number;
  private selectedCurrencyRate$ = new BehaviorSubject<ICurrencyRate>(null);

  columns: Array<IGridColumn> = [
    { prop: 'fromDateTime', renderer: 'dateTimeRenderer' },
    { prop: 'rate' }
  ];

  toolbarItems: Array<IToolbarItem>;

  dialog: 'delete';
  private _currencyRates: Array<ICurrencyRate> = [];

  private viewPermissionSubscription: Subscription;
  private currencyRateSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private currencyRatesService: CurrencyRatesService,
    private store: Store<IAppState>,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .pipe(first())
    .subscribe(columns => {
      this.columns = [...columns];
      this.cdRef.markForCheck();
    });

    this.toolbarItems = this.createToolbar();

    this.viewPermissionSubscription = combineLatest(
      this.currencyRatesService.canView$,
      this.currencyId$
    )
    .subscribe(([hasViewPermission, currencyId]) => {
      this.currencyId = currencyId;
      if (hasViewPermission && currencyId) {
        this.fetch();
      } else {
        this.clear();
        if (!hasViewPermission) {
          this.notificationsService.permissionError().entity('entities.currencyRates.gen.plural').dispatch();
        }
      }
    });

    this.currencyRateSubscription = this.currencyRatesService
      .getAction(CurrencyRatesService.MESSAGE_CURRENCY_RATE_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedCurrencyRate$.next(this.selectedCurrencyRate);
      });
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
    this.currencyRateSubscription.unsubscribe();
  }

  get currencyRates(): Array<ICurrencyRate> {
    return this._currencyRates;
  }

  get selectedCurrencyRate(): ICurrencyRate {
    return (this._currencyRates || [])
      .find(rate => this.selectedCurrencyRate$.value && rate.id === this.selectedCurrencyRate$.value.id);
  }

  get selection(): Array<ICurrencyRate> {
    const selectedCurrencyRate = this.selectedCurrencyRate;
    return selectedCurrencyRate ? [ selectedCurrencyRate ] : [];
  }

  onSelect(currencyRate: ICurrencyRate): void {
    this.selectedCurrencyRate$.next(currencyRate);
  }

  onEdit(currencyRate: ICurrencyRate): void {
    this.routingService.navigate([ `${this.currencyId}/rates/${currencyRate.id}` ], this.route);
  }

  onExcelLoad(currencyId: number): void {
    this.router.navigate([`/utilities/data-upload`]).then(() => {
      this.store.dispatch({
        type: IActionType.SELECT_CURRENCY,
        payload: { currencyId },
      });
    });
  }

  private onAdd(): void {
    this.routingService.navigate([ `${this.currencyId}/rates/create` ], this.route);
  }

  private fetch(): void {
    this.currencyRatesService.fetchAll(this.currencyId)
      .subscribe(currencyRates => {
        this._currencyRates = currencyRates;
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this._currencyRates = [];
    this.cdRef.markForCheck();
  }

  private createToolbar(): IToolbarItem[] {
    return [
      {
        type: ToolbarItemTypeEnum.BUTTON_ADD,
        enabled: combineLatestAnd([
          this.currencyRatesService.canAdd$,
          this.currencyId$.map(Boolean)
        ]),
        action: () => this.onAdd()
      },
      {
        type: ToolbarItemTypeEnum.BUTTON_EDIT,
        action: () => this.onEdit(this.selectedCurrencyRate$.value),
        enabled: combineLatestAnd([
          this.currencyRatesService.canEdit$,
          this.selectedCurrencyRate$.map(o => !!o)
        ])
      },
      {
        type: ToolbarItemTypeEnum.BUTTON_EXCEL_LOAD,
        action: () => this.onExcelLoad(this.currencyId),
        enabled: combineLatestAnd([
          this.currencyRatesService.canLoad$,
          this.currencyId$.map(Boolean)
        ])
      },
      {
        type: ToolbarItemTypeEnum.BUTTON_REFRESH,
        action: () => this.fetch(),
        enabled: combineLatestAnd([
          this.currencyRatesService.canView$,
          this.currencyId$.map(Boolean)
        ])
      }
    ];
  }
}
