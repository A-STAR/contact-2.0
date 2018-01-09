import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObjectModule } from './objects/objects.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PermissionsTreeModule } from './permissions-tree/permissions-tree.module';
import { RolesModule as RolesGridModule } from './roles/roles.module';
import { SharedModule } from '../../../shared/shared.module';

import { RolesAndPermissionsComponent } from './roles-and-permissions.component';

const routes: Routes = [
  {
    path: '',
    component: RolesAndPermissionsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'permissions',
      },
      {
        path: 'permissions',
        loadChildren: './permissions/permissions.module#PermissionsModule',
      },
      {
        path: 'access',
        loadChildren: './permissions-tree/permissions-tree.module#PermissionsTreeModule',
      },
      {
        path: 'objects',
        loadChildren: './objects/objects.module#RoleObjectsModule',
      }
    ],
  },
];

@NgModule({
  imports: [
    ObjectModule,
    PermissionsModule,
    PermissionsTreeModule,
    RolesGridModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    RolesAndPermissionsComponent,
  ]
})
export class RolesModule {
}
