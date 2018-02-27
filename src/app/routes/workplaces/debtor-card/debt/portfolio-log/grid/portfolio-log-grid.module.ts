import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { PortfolioLogGridComponent } from './portfolio-log-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PortfolioLogGridComponent,
  ],
  declarations: [
    PortfolioLogGridComponent,
  ],
  entryComponents: [
    PortfolioLogGridComponent,
  ]
})
export class PortfolioLogGridModule { }
