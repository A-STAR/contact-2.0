import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { UserConstantsEffects } from './constants/user-constants.effects';
import { UserConstantsService } from './constants/user-constants.service';
import { UserDictionariesEffects } from './dictionaries/user-dictionaries.effects';
import { UserDictionariesService } from './dictionaries/user-dictionaries.service';
import { UserPermissionsEffects } from './permissions/user-permissions.effects';
import { UserPermissionsService } from './permissions/user-permissions.service';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.run(UserConstantsEffects),
    EffectsModule.run(UserDictionariesEffects),
    EffectsModule.run(UserPermissionsEffects),
  ],
  providers: [
    UserConstantsService,
    UserDictionariesService,
    UserPermissionsService,
  ]
})
export class UserModule { }
