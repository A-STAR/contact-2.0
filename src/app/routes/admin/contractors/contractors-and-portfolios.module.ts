import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorsModule } from './contractors/contractors.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { SharedModule } from '../../../shared/shared.module';

import { ContractorsAndPortfoliosService } from './contractors-and-portfolios.service';

import { ContractorsAndPortfoliosComponent } from './contractors-and-portfolios.component';
import { ContractorEditComponent } from './contractors/edit/contractor-edit.component';
import { ContractorManagersComponent } from './contractors/managers/managers.component';
import { ContractorManagerEditComponent } from './contractors/managers/edit/manager-edit.component';
import { PortfolioEditComponent } from './portfolios/edit/portfolio-edit.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ContractorsAndPortfoliosComponent },
  { path: 'create', component: ContractorEditComponent },
  { path: ':contractorId', children: [
      { path: '', pathMatch: 'full', component: ContractorEditComponent },
      { path: 'managers', children: [
          { path: '', pathMatch: 'full', component: ContractorManagersComponent },
          { path: 'create', component: ContractorManagerEditComponent },
          { path: ':managerId', component: ContractorManagerEditComponent },
        ]
      },
      { path: 'portfolios', children: [
          { path: '', pathMatch: 'full', redirectTo: 'create' },
          { path: 'create', component: PortfolioEditComponent },
          { path: ':portfolioId', component: PortfolioEditComponent },
        ]
      },
    ]
  },
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
  ],
  providers: [
    ContractorsAndPortfoliosService
  ]
})
export class ContractorsAndPortfoliosModule {
}
