import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';

import { PermissionsEffects } from './admin/roles/permissions.effects';
import { PermissionsService } from './admin/roles/permissions.service';

const routes: Route[] = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'app' },
      { path: 'app', loadChildren: 'app/layout/layout.module#LayoutModule' },
      { path: 'login', loadChildren: './pages/login/login.module#LoginModule' },
      { path: 'logout', loadChildren: './pages/login/login.module#LoginModule' },
      { path: 'connection-error', loadChildren: './pages/connection-error/connection-error.module#ConnectionErrorModule' },
      { path: '**', redirectTo: '' },
    ]
  }
];

@NgModule({
  imports: [
    EffectsModule.forFeature([PermissionsEffects]),
    RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' }),
    SharedModule,
  ],
  providers: [
    PermissionsService,
  ],
  exports: [
    RouterModule,
  ],
})
export class RoutesModule {}
