import { NgModule } from '@angular/core';

import { AttributesModule } from './attributes/attributes.module';
import { ObjectsModule } from './objects/objects.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContractorCardComponent } from './contractor-card.component';
import { Routes, RouterModule } from '@angular/router';

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
    AttributesModule,
    ObjectsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    ContractorCardComponent
  ],
  declarations: [
    ContractorCardComponent,
  ],
})
export class ContractorCardModule {}
