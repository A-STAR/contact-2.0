import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComponentLogModule } from './component-log/component-log.module';
import { PortfolioLogModule } from './portfolio-log/portfolio-log.module';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtComponent } from './debt.component';

const routes: Routes = [
  {
    path: '',
    component: DebtComponent,
  }
];

@NgModule({
  imports: [
    ComponentLogModule,
    PortfolioLogModule,
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtComponent,
  ],
})
export class DebtModule {}
