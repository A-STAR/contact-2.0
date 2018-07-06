import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ICurrencyRate } from '../currency-rates.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { CurrencyRatesService } from '../currency-rates.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { DateRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel, combineLatestAnd, isEmpty } from '@app/core/utils';

@Component({
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-currency-rates-grid',
  templateUrl: './currency-rates-grid.component.html',
})
export class CurrencyRatesGridComponent implements OnInit, OnDestroy {
  @Input() currencyId$: Observable<number>;

  private currencyId: number;
  private selectedCurrencyRate$ = new BehaviorSubject<ICurrencyRate>(null);

  columns: ISimpleGridColumn<ICurrencyRate>[] = [
    { prop: 'fromDate', renderer: DateRendererComponent },
    { prop: 'rate' }
  ].map(addGridLabel('widgets.currencyRates.grid'));

  toolbarItems: Array<IToolbarItem>;

  dialog: 'delete';
  private _currencyRates: Array<ICurrencyRate> = [];

  private viewPermissionSubscription: Subscription;
  private currencyRateSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private currencyRatesService: CurrencyRatesService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
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

  onSelect(currencyRates: ICurrencyRate[]): void {
    const currencyRate = isEmpty(currencyRates)
      ? null
      : currencyRates[0];
    this.selectedCurrencyRate$.next(currencyRate);
  }

  onEdit(currencyRate: ICurrencyRate): void {
    this.routingService.navigate([ `${this.currencyId}/rates/${currencyRate.id}` ], this.route);
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
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        enabled: combineLatestAnd([
          this.currencyRatesService.canAdd$,
          this.currencyId$.map(Boolean)
        ]),
        action: () => this.onAdd()
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        action: () => this.onEdit(this.selectedCurrencyRate$.value),
        enabled: combineLatestAnd([
          this.currencyRatesService.canEdit$,
          this.selectedCurrencyRate$.map(o => !!o)
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.fetch(),
        enabled: combineLatestAnd([
          this.currencyRatesService.canView$,
          this.currencyId$.map(Boolean)
        ])
      }
    ];
  }
}
