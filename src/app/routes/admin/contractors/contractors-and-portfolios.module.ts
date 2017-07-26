import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { ContractorsModule } from './contractors/contractors.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { SharedModule } from '../../../shared/shared.module';

import { ContractorsAndPortfoliosEffects } from './contractors-and-portfolios.effects';
import { ContractorsAndPortfoliosService } from './contractors-and-portfolios.service';

import { ContractorsAndPortfoliosComponent } from './contractors-and-portfolios.component';
import { ContractorEditComponent } from './contractors/edit/contractor-edit.component';
import { ContractorManagersComponent } from './contractors/managers/contractor-managers.component';
import { ContractorManagerEditComponent } from './contractors/managers/edit/contractor-manager-edit.component';
import { PortfolioEditComponent } from './portfolios/edit/portfolio-edit.component';

const routes: Routes = [
  { path: '', component: ContractorsAndPortfoliosComponent },
  { path: 'create', component: ContractorEditComponent },
  { path: ':id', component: ContractorEditComponent },
  { path: ':id/managers', component: ContractorManagersComponent },
  { path: ':id/managers/create', component: ContractorManagerEditComponent },
  { path: ':id/managers/:managerId', component: ContractorManagerEditComponent },
  { path: ':id/portfolios/create', component: PortfolioEditComponent },
  { path: ':id/portfolios/:portfolioId', component: PortfolioEditComponent },
];

@NgModule({
  imports: [
    ContractorsModule,
    EffectsModule.run(ContractorsAndPortfoliosEffects),
    PortfoliosModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    ContractorsAndPortfoliosComponent,
  ],
  providers: [
    ContractorsAndPortfoliosService
  ]
})
export class ContractorsAndPortfoliosModule {
}