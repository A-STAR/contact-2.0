import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ICurrencyRate } from '../currency-rates.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { CurrencyRatesService } from '../currency-rates.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';

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

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.currencyRatesService.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedCurrencyRate$.value),
      enabled: Observable.combineLatest(
        this.currencyRatesService.canEdit$,
        this.selectedCurrencyRate$
      ).map(([canEdit, selectedProperty]) => !!canEdit && !!selectedProperty)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.currencyId && this.fetch(),
      enabled: this.currencyRatesService.canView$
    }
  ];

  dialog: 'delete';

  private _currencyRates: Array<ICurrencyRate> = [];

  private viewPermissionSubscription: Subscription;
  private currencyRateSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private currencyRatesService: CurrencyRatesService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .pipe(first())
    .subscribe(columns => {
      this.columns = [...columns];
      this.cdRef.markForCheck();
    });

    this.viewPermissionSubscription = combineLatest(
      this.currencyRatesService.canView$,
      this.currencyId$
    ).subscribe(([hasViewPermission, currencyId]) => {
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
    this.router.navigate([ `${this.router.url}/${this.currencyId}/rates/${currencyRate.id}` ]);
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/${this.currencyId}/rates/create` ]);
  }

  private fetch(): void {
    this.currencyRatesService.fetchAll(this.currencyId).subscribe(currencyRates => {
      this._currencyRates = currencyRates;
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this._currencyRates = [];
    this.cdRef.markForCheck();
  }
}
