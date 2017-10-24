import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioLogGridModule } from './grid/portfolio-log-grid.module';

import { PortfolioLogService } from './portfolio-log.service';

@NgModule({
  imports: [
    PortfolioLogGridModule,
    CommonModule,
  ],
  exports: [
    PortfolioLogGridModule,
  ],
  providers: [
    PortfolioLogService,
  ]
})
export class PortfolioLogModule { }
