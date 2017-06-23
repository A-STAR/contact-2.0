import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../shared/shared.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule as RolesGridModule } from './roles/roles.module';
import { PermissionsTreeModule } from './permissions-tree/permissions-tree.module';

import { PermissionsEffects } from './permissions.effects';
import { PermissionsService } from './permissions.service';

import { RolesAndPermissionsComponent } from './roles-and-permissions.component';

const routes: Routes = [
  {path: '', component: RolesAndPermissionsComponent},
];

@NgModule({
  imports: [
    EffectsModule.run(PermissionsEffects),
    RouterModule.forChild(routes),
    PermissionsModule,
    RolesGridModule,
    SharedModule,
    PermissionsTreeModule,
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    PermissionsService,
  ],
  declarations: [
    RolesAndPermissionsComponent,
  ]
})
export class RolesModule {
}
