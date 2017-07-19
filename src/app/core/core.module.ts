import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { DatePipe } from '@angular/common';

import { JwtHelper } from 'angular2-jwt';
import { TranslateService } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { AuthEffects } from './auth/auth.effects';
import { AuthHttpService } from './auth/auth-http.service';
import { AuthService } from './auth/auth.service';
import { ContentTabService } from '../shared/components/content-tabstrip/tab/content-tab.service';
import { DataService } from './data/data.service';
import { DictionariesEffects } from './dictionaries/dictionaries.effects';
import { DictionariesService } from './dictionaries/dictionaries.service';
import { EntityTranslationsService } from './entity/translations/entity-translations.service';
import { ErrorHandlerService } from './error/error-handler.service';
import { LookupEffects } from './lookup/lookup.effects';
import { LookupService } from './lookup/lookup.service';
import { MenuService } from './menu/menu.service';
import { MetadataService } from './metadata/metadata.service';
import { NotificationsEffects } from './notifications/notifications.effects';
import { NotificationsService } from './notifications/notifications.service';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { MetadataEffects } from './metadata/metadata.effects';
import { UserConstantsEffects } from './user/constants/user-constants.effects';
import { UserConstantsService } from './user/constants/user-constants.service';
import { UserDictionariesEffects } from './user/dictionaries/user-dictionaries.effects';
import { UserDictionariesService } from './user/dictionaries/user-dictionaries.service';
import { UserLanguagesEffects } from './user/languages/user-languages.effects';
import { UserLanguagesService } from './user/languages/user-languages.service';
import { UserPermissionsEffects } from './user/permissions/user-permissions.effects';
import { UserPermissionsService } from './user/permissions/user-permissions.service';
import { ValueConverterService } from './converter/value/value-converter.service';

import { rootReducer } from './state/root.reducer';

@NgModule({
  imports: [
    StoreModule.provideStore(rootReducer),
    EffectsModule.run(AuthEffects),
    EffectsModule.run(DictionariesEffects),
    EffectsModule.run(LookupEffects),
    EffectsModule.run(NotificationsEffects),
    EffectsModule.run(UserConstantsEffects),
    EffectsModule.run(UserDictionariesEffects),
    EffectsModule.run(UserLanguagesEffects),
    EffectsModule.run(UserPermissionsEffects),
    EffectsModule.run(MetadataEffects),
    environment.production
      ? []
      : StoreDevtoolsModule.instrumentOnlyWithExtension({
          maxAge: 1024
        })
  ],
  providers: [
    AuthHttpService,
    AuthService,
    ContentTabService,
    EntityTranslationsService,
    DictionariesService,
    DatePipe,
    DataService,
    JwtHelper,
    LookupService,
    MenuService,
    MetadataService,
    NotificationsService,
    SettingsService,
    ThemesService,
    TranslateService,
    UserConstantsService,
    UserDictionariesService,
    UserLanguagesService,
    UserPermissionsService,
    ValueConverterService,
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService
    }
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
