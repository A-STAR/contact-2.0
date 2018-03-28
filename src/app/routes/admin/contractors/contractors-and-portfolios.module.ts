import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorGridModule } from './contractor/grid/contractor-grid.module';
import { PortfoliosGridModule } from './portfolios/grid/portfolios-grid.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContractorsAndPortfoliosService } from './contractors-and-portfolios.service';

import { ContractorsAndPortfoliosComponent } from './contractors-and-portfolios.component';

const routes: Routes = [
  {
    path: '',
    component: ContractorsAndPortfoliosComponent,
    data: {
      reuse: true,
    },
  }
];

@NgModule({
  imports: [
    ContractorGridModule,
    PortfoliosGridModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    ContractorsAndPortfoliosComponent
  ],
  providers: [
    ContractorsAndPortfoliosService
  ]
})
export class ContractorsAndPortfoliosModule {
}
