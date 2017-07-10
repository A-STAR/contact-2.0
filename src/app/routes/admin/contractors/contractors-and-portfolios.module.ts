import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorsModule } from './contractors/contractors.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { SharedModule } from '../../../shared/shared.module';

import { ContractorsAndPortfoliosComponent } from './contractors-and-portfolios.component';

const routes: Routes = [
  { path: '', component: ContractorsAndPortfoliosComponent },
];

@NgModule({
  imports: [
    ContractorsModule,
    PortfoliosModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    ContractorsAndPortfoliosComponent,
  ]
})
export class ContractorsAndPortfoliosModule {
}
