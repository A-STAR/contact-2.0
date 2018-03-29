import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'roles',
      },
      {
        path: 'constants',
        loadChildren: './constants/constants.module#ConstantsModule',
      },
      {
        path: 'roles',
        loadChildren: './roles/roles.module#RolesModule',
      },
      {
        path: 'dictionaries',
        loadChildren: './dictionaries/dictionaries.module#DictionariesModule',
      },
      {
        path: 'users',
        loadChildren: './users/users.module#UsersModule',
      },
      {
        path: 'users/create',
        loadChildren: './users/card/user-card.module#UserCardModule',
      },
      {
        path: 'users/:userId',
        loadChildren: './users/card/user-card.module#UserCardModule',
      },
      {
        path: 'organizations',
        loadChildren: './organizations/organizations.module#OrganizationsModule',
      },
      {
        path: 'action-log',
        loadChildren: './actions-log/actions-log.module#ActionsLogModule',
      },
      {
        path: 'contractors',
        loadChildren: './contractors/contractors-and-portfolios.module#ContractorsAndPortfoliosModule',
      },
      {
        path: 'contractors/create',
        loadChildren: './contractors/contractor/card/contractor-card.module#ContractorCardModule',
      },
      {
        path: 'contractors/:contractorId',
        loadChildren: './contractors/contractor/card/contractor-card.module#ContractorCardModule',
      },
      {
        path: 'contractors/:contractorId/attributes',
        loadChildren: './contractors/contractor/card/attributes/attributes.module#AttributesModule',
      },
      {
        path: 'contractors/:contractorId/attributes/:attributeId/versions',
        loadChildren: './contractors/versions/versions.module#VersionsModule',
      },
      {
        path: 'contractors/:contractorId/managers',
        loadChildren: './contractors/contractor/card/managers/managers.module#ManagersModule',
      },
      {
        path: 'contractors/:contractorId/managers/create',
        loadChildren: './contractors/contractor/card/managers/card/manager-card.module#ManagerCardModule',
      },
      {
        path: 'contractors/:contractorId/managers/:managerId',
        loadChildren: './contractors/contractor/card/managers/card/manager-card.module#ManagerCardModule',
      },
      {
        path: 'contractors/:contractorId/objects',
        loadChildren: './contractors/contractor/card/objects/objects.module#ObjectsModule',
      },
      {
        path: 'contractors/:contractorId/portfolios/create',
        loadChildren: './contractors/portfolios/card/portfolio-card.module#PortfolioCardModule',
      },
      {
        path: 'contractors/:contractorId/portfolios/:portfolioId',
        loadChildren: './contractors/portfolios/card/portfolio-card.module#PortfolioCardModule',
      },
      {
        path: 'contractors/:contractorId/portfolios/:portfolioId/attributes',
        loadChildren: './contractors/portfolios/card/attributes/portfolio-attributes.module#PortfolioAttributesModule',
      },
      {
        path: 'contractors/:contractorId/portfolios/:portfolioId/attributes/:attributeId/versions',
        loadChildren: './contractors/versions/versions.module#VersionsModule',
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    AdminComponent,
  ],
})
export class AdminModule {}
