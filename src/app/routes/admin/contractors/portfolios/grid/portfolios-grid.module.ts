import { NgModule } from '@angular/core';

import { PortfolioMoveModule } from './move/portfolio-move.module';
import { PortfolioSendModule } from './send/portfolio-send.module';
import { SharedModule } from '@app/shared/shared.module';

import { PortfoliosGridComponent } from './portfolios-grid.component';

@NgModule({
  imports: [
    PortfolioMoveModule,
    PortfolioSendModule,
    SharedModule,
  ],
  exports: [
    PortfoliosGridComponent,
  ],
  declarations: [
    PortfoliosGridComponent,
  ],
})
export class PortfoliosGridModule {}
