import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-currency-tab',
  templateUrl: './edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyEditComponent {
  constructor(
    private route: ActivatedRoute,
  ) {}

  get currencyId(): number {
    return Number(this.route.snapshot.paramMap.get('currencyId'));
  }
}
