import { NgModule } from '@angular/core';

import { PortfolioEditModule } from './edit/portfolio-edit.module';
import { PortfolioMoveModule } from './move/portfolio-move.module';
import { SharedModule } from '../../../../shared/shared.module';

import { PortfoliosComponent } from './portfolios.component';

@NgModule({
  imports: [
    PortfolioEditModule,
    PortfolioMoveModule,
    SharedModule,
  ],
  exports: [
    PortfolioEditModule,
    PortfolioMoveModule,
    PortfoliosComponent,
  ],
  declarations: [
    PortfoliosComponent,
  ]
})
export class PortfoliosModule {
}
