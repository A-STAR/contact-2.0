import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { ContractorsAndPortfoliosComponent } from './contractors-and-portfolios.component';

const routes: Routes = [
  { path: '', component: ContractorsAndPortfoliosComponent },
];

@NgModule({
  imports: [
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
