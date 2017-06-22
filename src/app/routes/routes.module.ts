import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { PagesModule } from './pages/pages.module';

import { MenuResolver } from '../core/menu/menu-resolver.service';
import { UserConstantsResolver } from '../core/user/constants/user-constants.resolver';
import { UserLanguagesResolver } from '../core/user/languages/user-languages.resolver';
import { UserPermissionsResolver } from '../core/user/permissions/user-permissions.resolver';

import { routes } from './routes';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes),
    PagesModule,
  ],
  providers: [
    MenuResolver,
    UserConstantsResolver,
    UserLanguagesResolver,
    UserPermissionsResolver,
  ],
  exports: [
    RouterModule
  ]
})

export class RoutesModule { }
