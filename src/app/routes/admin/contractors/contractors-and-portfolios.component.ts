import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-contractors-and-portfolios',
  templateUrl: './contractors-and-portfolios.component.html',
})
export class ContractorsAndPortfoliosComponent {}
