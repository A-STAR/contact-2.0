import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DatePipe } from '@angular/common';

import { JwtHelper } from 'angular2-jwt';
import { TranslateService } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { AuthHttpService } from './auth/auth-http.service';
import { AuthService } from './auth/auth.service';
import { ConstantsEffects } from './constants/constants.effects';
import { ConstantsService } from './constants/constants.service';
import { DictionariesEffects } from './dictionaries/dictionaries.effects';
import { DictionariesService } from './dictionaries/dictionaries.service';
import { EntityTranslationsService } from './entity/translations/entity-translations.service';
import { MenuService } from './menu/menu.service';
import { NotificationsEffects } from './notifications/notifications.effects';
import { NotificationsService } from './notifications/notifications.service';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { PermissionsEffects } from './permissions/permissions.effects';
import { PermissionsService } from './permissions/permissions.service';
import { UserConstantsService } from './user/constants/user-constants.service';
import { ValueConverterService } from './converter/value/value-converter.service';

import { rootReducer } from './state/root.reducer';

@NgModule({
  imports: [
    StoreModule.provideStore(rootReducer),
    EffectsModule.run(ConstantsEffects),
    EffectsModule.run(DictionariesEffects),
    EffectsModule.run(NotificationsEffects),
    EffectsModule.run(PermissionsEffects),
    EffectsModule.run(UserConstantsService),
    environment.production
      ? []
      : StoreDevtoolsModule.instrumentOnlyWithExtension({
          maxAge: 1024
        })
  ],
  providers: [
    AuthHttpService,
    AuthService,
    EntityTranslationsService,
    ConstantsService,
    DictionariesService,
    DatePipe,
    JwtHelper,
    MenuService,
    NotificationsService,
    PermissionsService,
    SettingsService,
    ThemesService,
    TranslateService,
    ValueConverterService,
  ],
  exports: [
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
