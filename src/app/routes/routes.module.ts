import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { PagesModule } from './pages/pages.module';

import { UserPermissionsResolver } from '../core/user/permissions/user-permissions-resolver.service';
import { MenuResolver } from '../core/menu/menu-resolver.service';

import { routes } from './routes';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes),
    PagesModule,
  ],
  providers: [
    MenuResolver,
    UserPermissionsResolver,
  ],
  exports: [
    RouterModule
  ]
})

export class RoutesModule { }
