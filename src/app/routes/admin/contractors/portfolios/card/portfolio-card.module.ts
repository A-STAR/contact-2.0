import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { ContractorsAndPortfoliosService } from './../../contractors-and-portfolios.service';

import { PortfolioCardComponent } from './portfolio-card.component';

const routes: Routes = [
  {
    path: '',
    component: PortfolioCardComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    PortfolioCardComponent
  ],
  declarations: [
    PortfolioCardComponent,
  ],
  providers: [ ContractorsAndPortfoliosService ],
})
export class PortfolioCardModule {}
