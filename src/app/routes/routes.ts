import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from '../core/auth/auth.service';

export const routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthService],
    children: [
      // { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'query-builder', loadChildren: './querybuilder/querybuilder.module#QueryBuilderModule' },
      { path: 'workflow', loadChildren: './tree/flow.module#FlowModule' },
      { path: 'grid', loadChildren: './tables/tables.module#TablesModule' },
    ]
  },

  // Eagerly-loaded routes
  { path: 'login', component: LoginComponent },

  // Not found
  { path: '**', redirectTo: 'LoginComponent' },

];
