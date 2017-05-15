import { AuthService } from '../core/auth/auth.service';
import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ConnectionErrorComponent } from './pages/connection-error/connection-error.component';

export const routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthService],
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
    canActivate: [AuthService],
    children: [
      { path: '', redirectTo: '../home', pathMatch: 'full' },
      { path: 'constants', loadChildren: './admin/constants/constants.module#ConstantsModule' },
      { path: 'roles-and-permissions', loadChildren: './admin/roles/roles.module#RolesModule' },
      { path: 'users', loadChildren: './admin/users/users.module#UsersModule' }
    ]
  },

  // Eagerly-loaded routes
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'connection-error', component: ConnectionErrorComponent },

  // Redirect home, if the path is not found
  { path: '**', redirectTo: '' },

];
