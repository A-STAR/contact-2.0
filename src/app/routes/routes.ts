import { Route } from '@angular/router';

import { AuthService } from '../core/auth/auth.service';

import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ConnectionErrorComponent } from './pages/connection-error/connection-error.component';

export const routes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [ AuthService ],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      {
        path: 'admin',
        children: [
          { path: '', redirectTo: '../home', pathMatch: 'full' },
          { path: 'constants', loadChildren: './admin/constants/constants.module#ConstantsModule' },
          { path: 'roles-and-permissions', loadChildren: './admin/roles/roles.module#RolesModule' },
          { path: 'dictionaries', loadChildren: './admin/dictionaries/dictionaries.module#DictionariesModule' },
          { path: 'users', loadChildren: './admin/users/users.module#UsersModule' },
          { path: 'organizations', loadChildren: './admin/organizations/organizations.module#OrganizationsModule' },
          { path: 'action-log', loadChildren: './admin/actions-log/actions-log.module#ActionsLogModule' },
          {
            path: 'contractors',
            loadChildren: './admin/contractors/contractors-and-portfolios.module#ContractorsAndPortfoliosModule'
          },
          { path: 'qbuilder', loadChildren: './querybuilder/querybuilder.module#QueryBuilderModule' },
        ]
      },
      {
        path: 'workplaces',
        children: [
          // { path: 'debts', loadChildren: './workplaces/debtors/debtors.module#DebtorsModule' },
          { path: 'debt-processing', loadChildren: './workplaces/debt-processing/debt-processing.module#DebtProcessingModule' },
          {
            path: 'contact-registration',
            loadChildren: './workplaces/contact-registration/contact-registration.module#ContactRegistrationModule'
          },
          { path: 'incoming-call', loadChildren: './workplaces/incoming-call/incoming-call.module#IncomingCallModule' },
          { path: 'call-center', loadChildren: './workplaces/call-center/call-center.module#CallCenterModule' },
          { path: 'contact-log', loadChildren: './workplaces/contact-log/contact-log.module#ContactLogModule' },
          { path: 'payments', loadChildren: './workplaces/payments/payments.module#PaymentsModule' },
        ]
      },
      {
        path: 'utilities',
        children: [
          {
            path: 'contact-properties',
            loadChildren: './utilities/contact-properties/contact-properties.module#ContactPropertiesModule',
          },
          {
            path: 'message-templates',
            loadChildren: './utilities/message-templates/message-templates.module#MessageTemplatesModule',
          },
          {
            path: 'campaigns',
            loadChildren: './utilities/campaigns/campaigns.module#CampaignsModule',
          },
        ]
      },
    ]
  },

  // Eagerly-loaded routes
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'connection-error', component: ConnectionErrorComponent },

  // Redirect home, if the path is not found
  { path: '**', redirectTo: '' },
];
