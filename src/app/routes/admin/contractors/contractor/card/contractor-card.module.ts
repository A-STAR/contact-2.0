import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { ContractorsAndPortfoliosService } from './../../contractors-and-portfolios.service';

import { ContractorCardComponent } from './contractor-card.component';

const routes: Routes = [
  {
    path: '',
    component: ContractorCardComponent,
    data: {
      reuse: true,
    }
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [ ContractorsAndPortfoliosService ],
  exports: [
    ContractorCardComponent
  ],
  declarations: [
    ContractorCardComponent,
  ],
})
export class ContractorCardModule {}
