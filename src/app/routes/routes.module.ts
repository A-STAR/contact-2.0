import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { PagesModule } from './pages/pages.module';

import { PermissionsEffects } from './admin/roles/permissions.effects';
import { PermissionsService } from './admin/roles/permissions.service';

import { routes } from './routes';

@NgModule({
  imports: [
    EffectsModule.forFeature([PermissionsEffects]),
    SharedModule,
    RouterModule.forRoot(routes),
    PagesModule,
  ],
  providers: [
    PermissionsService,
  ],
  exports: [
    RouterModule
  ]
})
export class RoutesModule { }
