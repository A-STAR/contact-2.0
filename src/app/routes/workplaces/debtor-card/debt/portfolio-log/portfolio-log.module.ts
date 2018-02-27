import { NgModule } from '@angular/core';

import { PortfolioLogGridModule } from './grid/portfolio-log-grid.module';

import { PortfolioLogService } from './portfolio-log.service';

@NgModule({
  imports: [
    PortfolioLogGridModule,
  ],
  exports: [
    PortfolioLogGridModule,
  ],
  providers: [
    PortfolioLogService,
  ]
})
export class PortfolioLogModule { }
