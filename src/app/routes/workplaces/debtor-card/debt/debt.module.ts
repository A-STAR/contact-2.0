import { NgModule } from '@angular/core';

import { ComponentLogModule } from './component-log/component-log.module';
import { PortfolioLogModule } from './portfolio-log/portfolio-log.module';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtComponent } from './debt.component';

@NgModule({
  imports: [
    ComponentLogModule,
    PortfolioLogModule,
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    DebtComponent,
  ],
  declarations: [
    DebtComponent,
  ],
})
export class DebtModule {}
