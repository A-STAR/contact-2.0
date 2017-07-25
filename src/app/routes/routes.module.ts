import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { PagesModule } from './pages/pages.module';

import { GuiObjectsResolver } from '../core/gui-objects/gui-objects.resolver';
import { LookupResolver } from '../core/lookup/lookup.resolver';
import { MetadataResolver } from '../core/metadata/metadata.resolver';
import { PermissionsEffects } from './admin/roles/permissions.effects';
import { PermissionsService } from './admin/roles/permissions.service';
import { UserConstantsResolver } from '../core/user/constants/user-constants.resolver';
import { UserLanguagesResolver } from '../core/user/languages/user-languages.resolver';
import { UserPermissionsResolver } from '../core/user/permissions/user-permissions.resolver';

import { routes } from './routes';

@NgModule({
  imports: [
    EffectsModule.run(PermissionsEffects),
    SharedModule,
    RouterModule.forRoot(routes),
    PagesModule,
  ],
  providers: [
    GuiObjectsResolver,
    LookupResolver,
    MetadataResolver,
    PermissionsService,
    UserConstantsResolver,
    UserLanguagesResolver,
    UserPermissionsResolver,
  ],
  exports: [
    RouterModule
  ]
})
export class RoutesModule { }
