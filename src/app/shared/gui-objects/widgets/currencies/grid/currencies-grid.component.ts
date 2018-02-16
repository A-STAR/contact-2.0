import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { ICurrency } from '@app/shared/gui-objects/widgets/currencies/currencies.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { ITitlebar } from '@app/shared/components/titlebar/titlebar.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { CurrenciesService } from '@app/shared/gui-objects/widgets/currencies/currencies.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { GridService } from '@app/shared/components/grid/grid.service';

import { DialogFunctions } from '@app/core/dialog';
import { combineLatestAnd } from 'app/core/utils/helpers';

@Component({
  selector: 'app-currencies-grid',
  templateUrl: './currencies-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedCurrency$ = new BehaviorSubject<ICurrency>(null);

  columns: Array<IGridColumn> = [
    { prop: 'id', width: 50 },
    { prop: 'code' },
    { prop: 'name' },
    { prop: 'shortName' },
    { prop: 'isMain', renderer: 'checkboxRenderer' },
  ];

  titlebar: ITitlebar = {
    title: 'widgets.currencies.titlebar.title'
  };

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.currenciesService.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedCurrency$.value),
      enabled: combineLatestAnd([
        this.currenciesService.canEdit$,
        this.selectedCurrency$.map(o => !!o)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('removeCurrency'),
      enabled: this.selectedCurrency$.flatMap(
        selectedCurrency => this.currenciesService.canDelete$(selectedCurrency),
      ),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.currenciesService.canView$
    }
  ];

  dialog: string;

  private _currencies: Array<ICurrency> = [];

  private viewPermissionSubscription: Subscription;
  private actionSubscription: Subscription;
  private currencySubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private currenciesService: CurrenciesService,
    private gridService: GridService,
    private route: ActivatedRoute,
    private routingService: RoutingService
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

    this.fetch();

    this.actionSubscription = this.currenciesService
      .getAction(CurrenciesService.MESSAGE_CURRENCY_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedCurrency$.next(this.selectedCurrency);
      });

    this.currencySubscription = this.selectedCurrency$.subscribe(currency =>
      this.currenciesService.dispatchAction(CurrenciesService.MESSAGE_CURRENCY_SELECTED, currency)
    );
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
    this.currencySubscription.unsubscribe();
  }

  get currencies(): Array<ICurrency> {
    return this._currencies;
  }

  get selectedCurrency(): ICurrency {
    return (this._currencies || [])
      .find(currency => this.selectedCurrency$.value && currency.id === this.selectedCurrency$.value.id);
  }

  get selection(): Array<ICurrency> {
    const selectedCurrency = this.selectedCurrency;
    return selectedCurrency ? [ selectedCurrency ] : [];
  }

  onSelect(currency: ICurrency): void {
    this.selectedCurrency$.next(currency);
  }

  onEdit(currency: ICurrency): void {
    this.routingService.navigate([ String(currency.id) ], this.route);
  }

  onRemove(): void {
    const { id: currencyId } = this.selectedCurrency;
    this.currenciesService.delete(currencyId)
      .subscribe(() => {
        this.setDialog(null);
        this.selectedCurrency$.next(null);
        this.fetch();
      });
  }

  private onAdd(): void {
    this.routingService.navigate([ 'create' ], this.route);
  }

  private fetch(): void {
    this.currenciesService.fetchAll().subscribe(currencies => {
      this._currencies = currencies;
      this.cdRef.markForCheck();
    });
  }
}
