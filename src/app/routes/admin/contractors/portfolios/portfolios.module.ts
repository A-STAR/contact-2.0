import { NgModule } from '@angular/core';

import { PortfolioEditModule } from './edit/portfolio-edit.module';
import { SharedModule } from '../../../../shared/shared.module';

import { PortfoliosComponent } from './portfolios.component';

@NgModule({
  imports: [
    PortfolioEditModule,
    SharedModule,
  ],
  exports: [
    PortfolioEditModule,
    PortfoliosComponent,
  ],
  declarations: [
    PortfoliosComponent,
  ]
})
export class PortfoliosModule {
}
