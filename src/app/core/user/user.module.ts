import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { UserAttributeTypesEffects } from './attribute-types/user-attribute-types.effects';
import { UserAttributeTypesService } from './attribute-types/user-attribute-types.service';
import { UserConstantsEffects } from './constants/user-constants.effects';
import { UserConstantsService } from './constants/user-constants.service';
import { UserDictionariesEffects } from './dictionaries/user-dictionaries.effects';
import { UserDictionariesService } from './dictionaries/user-dictionaries.service';
import { UserPermissionsEffects } from './permissions/user-permissions.effects';
import { UserPermissionsService } from './permissions/user-permissions.service';
import { UserTemplatesEffects } from './templates/user-templates.effects';
import { UserTemplatesService } from './templates/user-templates.service';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([
      UserAttributeTypesEffects,
      UserConstantsEffects,
      UserDictionariesEffects,
      UserPermissionsEffects,
      UserTemplatesEffects
    ]),
  ],
  providers: [
    UserAttributeTypesService,
    UserConstantsService,
    UserDictionariesService,
    UserPermissionsService,
    UserTemplatesService,
  ]
})
export class UserModule { }
