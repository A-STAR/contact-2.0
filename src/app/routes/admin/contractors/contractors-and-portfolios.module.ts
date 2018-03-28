import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorGridModule } from './contractor/grid/contractor-grid.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { SharedModule } from '@app/shared/shared.module';
import { ContractorsAndPortfoliosVersionModule } from './version/contractors-and-portfolios-version.module';

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
    PortfoliosModule,
    ContractorsAndPortfoliosVersionModule,
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
