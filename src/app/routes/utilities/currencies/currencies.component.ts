import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { ICurrency } from './currencies.interface';

import { CurrenciesService } from './currencies.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesComponent implements OnInit, OnDestroy {
  selectedCurrency$ = new BehaviorSubject<number>(null);

  private selectedCurrencySubscription: Subscription;

  constructor(
    private currenciesService: CurrenciesService,
  ) {}

  ngOnInit(): void {
    this.selectedCurrencySubscription = this.currenciesService
      .getPayload<ICurrency>(CurrenciesService.MESSAGE_CURRENCY_SELECTED)
      .map(currency => currency ? currency.id : null)
      .subscribe(currencyId => this.selectedCurrency$.next(currencyId));
  }

  ngOnDestroy(): void {
    this.selectedCurrencySubscription.unsubscribe();
  }
}

