import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularSplitModule } from 'angular-split';

import { RolesModule as RolesGridModule } from './roles/roles.module';
import { SharedModule } from '@app/shared/shared.module';

import { CanActivateTabGuard } from '@app/shared/components/layout/tabview/header/header.service';

import { RolesAndPermissionsComponent } from './roles-and-permissions.component';

const routes: Routes = [
  {
    path: '',
    component: RolesAndPermissionsComponent,
    canActivate: [ CanActivateTabGuard ],
    canActivateChild: [ CanActivateTabGuard ],
    data: {
      reuse: true,
      tabs: [
        {
          link: 'permissions',
          permission: 'PERMIT_VIEW'
        },
        // {
        //   link: 'access',
        //   title: 'roles.permissions.access.title',
        //   permission: ''
        // },
        {
          link: 'objects',
          hasPermission: 'OBJECT_ROLE_VIEW'
        },
      ]
    },
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
      // {
      //   path: 'access',
      //   loadChildren: './permissions-tree/permissions-tree.module#PermissionsTreeModule',
      // },
      {
        path: 'objects',
        loadChildren: './objects/objects.module#ObjectModule',
      }
    ],
  },
];

@NgModule({
  imports: [
    AngularSplitModule,
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
export class RolesModule {}
