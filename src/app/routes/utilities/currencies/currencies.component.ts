import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ICurrency } from 'app/shared/gui-objects/widgets/currencies/currencies.interface';

import { CurrenciesService } from 'app/shared/gui-objects/widgets/currencies/currencies.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesComponent implements OnInit {
  selectedCurrency$: Observable<number>;

  constructor(
    private currenciesService: CurrenciesService,
  ) {}

  ngOnInit(): void {
    this.selectedCurrency$ = this.currenciesService
      .getPayload<ICurrency>(CurrenciesService.MESSAGE_CURRENCY_SELECTED)
      .map(currency => currency ? currency.id : null);
  }
}

