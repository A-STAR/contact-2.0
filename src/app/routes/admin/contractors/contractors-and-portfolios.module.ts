import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorsModule } from './contractors/contractors.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { SharedModule } from '@app/shared/shared.module';
import { ContractorsAndPortfoliosVersionModule } from './version/contractors-and-portfolios-version.module';

import { ContractorsAndPortfoliosService } from './contractors-and-portfolios.service';

import { ContractorsAndPortfoliosComponent } from './contractors-and-portfolios.component';
import { ContractorEditComponent } from './contractors/edit/contractor-edit.component';
import { ContractorManagersComponent } from './contractors/managers/managers.component';
import { ContractorManagerEditComponent } from './contractors/managers/edit/manager-edit.component';
import { ContractorObjectsComponent } from './contractors/edit/objects/contractor-objects.component';
import { PortfolioEditComponent } from './portfolios/edit/portfolio-edit.component';
import { ContractorAttributesComponent } from './contractors/edit/attributes/contractor-attributes.component';
import { PortfolioAttributesComponent } from './portfolios/edit/attributes/portfolio-attributes.component';
import { ContractorsAndPortfoliosVersionComponent } from './version/contractors-and-portfolios-version.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ContractorsAndPortfoliosComponent,
    data: {
      reuse: true,
    },
  },
  {
    path: 'create',
    component: ContractorEditComponent,
  },
  {
    path: ':contractorId', children: [
      { path: '', pathMatch: 'full', component: ContractorEditComponent },
      {
        path: 'managers', children: [
          { path: '', pathMatch: 'full', component: ContractorManagersComponent },
          { path: 'create', component: ContractorManagerEditComponent },
          { path: ':managerId', component: ContractorManagerEditComponent },
        ]
      },
      {
        path: 'portfolios', children: [
          { path: '', pathMatch: 'full', redirectTo: 'create' },
          { path: 'create', component: PortfolioEditComponent },
          {
            path: ':portfolioId', children: [
              { path: '', pathMatch: 'full', component: PortfolioEditComponent },
              {
                path: 'attributes', children: [
                  { path: '', component: PortfolioAttributesComponent },
                  {
                    path: ':attributeId/versions', component: ContractorsAndPortfoliosVersionComponent
                  }
                ]
              }
            ]
          },
        ]
      },
      {
        path: 'attributes', children: [
          { path: '', component: ContractorAttributesComponent },
          { path: ':attributeId/versions', component: ContractorsAndPortfoliosVersionComponent },
        ]
      },
      {
        path: 'objects', children: [
          { path: '', component: ContractorObjectsComponent },
        ]
      }
    ],
  },
];

@NgModule({
  imports: [
    ContractorsModule,
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
