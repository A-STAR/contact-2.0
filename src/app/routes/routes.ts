import { Route } from '@angular/router';

import { AuthService } from '../core/auth/auth.service';
import { MenuResolver } from '../core/menu/menu-resolver.service';
import { UserConstantsResolver } from '../core/user/constants/user-constants.resolver';
import { UserLanguagesResolver } from '../core/user/languages/user-languages.resolver';
import { UserPermissionsResolver } from '../core/user/permissions/user-permissions.resolver';

import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ConnectionErrorComponent } from './pages/connection-error/connection-error.component';

export const routes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [ AuthService ],
    resolve: {
      menu: MenuResolver
    },
    runGuardsAndResolvers: 'paramsChange',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: './dashboard/dashboard.module#DashboardModule' },
    ]
  },
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [ AuthService ],
    resolve: {
      menu: MenuResolver,
      userConstantsResolved: UserConstantsResolver,
      userLanguagesResolved: UserLanguagesResolver,
      userPermissionsResolved: UserPermissionsResolver
    },
    runGuardsAndResolvers: 'paramsChange',
    children: [
      { path: '', redirectTo: '../home', pathMatch: 'full' },
      { path: 'constants', loadChildren: './admin/constants/constants.module#ConstantsModule' },
      { path: 'roles-and-permissions', loadChildren: './admin/roles/roles.module#RolesModule' },
      { path: 'dictionaries', loadChildren: './admin/dictionaries/dictionary.module#DictionaryModule' },
      { path: 'users', loadChildren: './admin/users/users.module#UsersModule' },
      { path: 'organizations', loadChildren: './admin/organizations/organizations.module#OrganizationsModule' },
      { path: 'action-log', loadChildren: './admin/actions-log/actions-log.module#ActionsLogModule' },
      { path: 'qbuilder', loadChildren: './querybuilder/querybuilder.module#QueryBuilderModule' },
    ]
  },

  // Eagerly-loaded routes
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'connection-error', component: ConnectionErrorComponent },

  // Redirect home, if the path is not found
  { path: '**', redirectTo: '' },
];
