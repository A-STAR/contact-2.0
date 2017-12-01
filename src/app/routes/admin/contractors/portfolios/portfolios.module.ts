import { NgModule } from '@angular/core';

import { PortfolioEditModule } from './edit/portfolio-edit.module';
import { PortfolioMoveModule } from './move/portfolio-move.module';
import { SharedModule } from '../../../../shared/shared.module';

import { PortfoliosComponent } from './portfolios.component';
import { PortfolioSendComponent } from './send/portfolio-send.component';

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
    PortfolioSendComponent
  ],
  declarations: [
    PortfoliosComponent,
    PortfolioSendComponent,
  ]
})
export class PortfoliosModule {
}
