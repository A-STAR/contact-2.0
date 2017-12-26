import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rate-tab',
  templateUrl: './rate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyRateEditComponent {
  static COMPONENT_NAME = 'CurrencyRateEditComponent';

  constructor(
    private route: ActivatedRoute,
  ) {}

  get currencyId(): number {
    return Number(this.route.snapshot.paramMap.get('currencyId'));
  }

  get currencyRateId(): number {
    return Number(this.route.snapshot.paramMap.get('currencyRateId'));
  }
}
