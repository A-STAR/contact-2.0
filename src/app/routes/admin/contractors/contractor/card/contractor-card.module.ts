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
    },
    // children: [
    //   {
    //     path: 'managers', children: [
    //       { path: '', pathMatch: 'full', component: ContractorManagersComponent },
    //       { path: 'create', component: ContractorManagerEditComponent },
    //       { path: ':managerId', component: ContractorManagerEditComponent },
    //     ]
    //   },
    //   {
    //     path: 'portfolios', children: [
    //       { path: '', pathMatch: 'full', redirectTo: 'create' },
    //       { path: 'create', component: PortfolioEditComponent },
    //       {
    //         path: ':portfolioId', children: [
    //           { path: '', pathMatch: 'full', component: PortfolioEditComponent },
    //           {
    //             path: 'attributes', children: [
    //               { path: '', component: PortfolioAttributesComponent },
    //               {
    //                 path: ':attributeId/versions', component: ContractorsAndPortfoliosVersionComponent
    //               }
    //             ]
    //           }
    //         ]
    //       },
    //     ]
    //   },
    //   {
    //     path: 'attributes', children: [
    //       { path: '', component: ContractorAttributesComponent },
    //       { path: ':attributeId/versions', component: ContractorsAndPortfoliosVersionComponent },
    //     ]
    //   },
    //   {
    //     path: 'objects', children: [
    //       { path: '', component: ContractorObjectsComponent },
    //     ]
    //   }
    // ],
  },
];


@NgModule({
  imports: [
    // AttributesModule,
    // ManagersModule,
    RouterModule.forChild(routes),
    // ObjectsModule,
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
