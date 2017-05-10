import { RouteCanActivateService } from '../core/route/route-can-activate.service';

import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './pages/login/login.component';

export const routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [RouteCanActivateService],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'query-builder', loadChildren: './querybuilder/querybuilder.module#QueryBuilderModule' },
      { path: 'workflow', loadChildren: './tree/flow.module#FlowModule' },
      { path: 'grid', loadChildren: './tables/tables.module#TablesModule' },
    ]
  },
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [RouteCanActivateService],
    children: [
      { path: '', redirectTo: '../home', pathMatch: 'full' },
      { path: 'constants', loadChildren: './admin/constants/constants.module#ConstantsModule' },
      { path: 'roles-and-permissions', loadChildren: './admin/roles/roles.module#RolesModule' }
    ]
  },

  // Eagerly-loaded routes
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },

  // Redirect home, if the path is not found
  { path: '**', redirectTo: '' },

];
