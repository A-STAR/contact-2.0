import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { PagesModule } from './pages/pages.module';

import { AuthService } from '../core/auth/auth.service';
import { PermissionsEffects } from './admin/roles/permissions.effects';
import { PermissionsService } from './admin/roles/permissions.service';

import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ConnectionErrorComponent } from './pages/connection-error/connection-error.component';

const routes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [ AuthService ],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
      { path: 'workplaces', loadChildren: './workplaces/workplaces.module#WorkplacesModule' },
      { path: 'utilities', loadChildren: './utilities/utilities.module#UtilitiesModule' },
      { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' },
      { path: 'ui', loadChildren: './ui/ui.module#UIModule' },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'connection-error', component: ConnectionErrorComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    EffectsModule.forFeature([PermissionsEffects]),
    PagesModule,
    RouterModule.forRoot(routes),
    SharedModule,
  ],
  providers: [
    PermissionsService,
  ],
  exports: [
    RouterModule,
  ],
})
export class RoutesModule { }
