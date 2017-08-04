import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { DatePipe } from '@angular/common';

import { JwtHelper } from 'angular2-jwt';
import { TranslateService } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { UserModule } from './user/user.module';

import { AuthEffects } from './auth/auth.effects';
import { AuthHttpService } from './auth/auth-http.service';
import { AuthService } from './auth/auth.service';
import { ContentTabService } from '../shared/components/content-tabstrip/tab/content-tab.service';
import { DataService } from './data/data.service';
import { DictionariesEffects } from './dictionaries/dictionaries.effects';
import { DictionariesService } from './dictionaries/dictionaries.service';
import { EntityTranslationsService } from './entity/translations/entity-translations.service';
import { ErrorHandlerService } from './error/error-handler.service';
import { GuiObjectsEffects } from './gui-objects/gui-objects.effects';
import { GuiObjectsService } from './gui-objects/gui-objects.service';
import { LookupEffects } from './lookup/lookup.effects';
import { LookupService } from './lookup/lookup.service';
import { MetadataService } from './metadata/metadata.service';
import { NotificationsEffects } from './notifications/notifications.effects';
import { NotificationsService } from './notifications/notifications.service';
import { PersistenceService } from './persistence/persistence.service';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { MetadataEffects } from './metadata/metadata.effects';
import { ValueConverterService } from './converter/value-converter.service';

import { rootReducer } from './state/root.reducer';

@NgModule({
  imports: [
    StoreModule.provideStore(rootReducer),
    EffectsModule.run(AuthEffects),
    EffectsModule.run(DictionariesEffects),
    EffectsModule.run(GuiObjectsEffects),
    EffectsModule.run(LookupEffects),
    EffectsModule.run(NotificationsEffects),
    EffectsModule.run(MetadataEffects),
    UserModule,
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
    GuiObjectsService,
    MetadataService,
    NotificationsService,
    PersistenceService,
    SettingsService,
    ThemesService,
    TranslateService,
    ValueConverterService,
    environment.production
      ? {
          provide: ErrorHandler,
          useClass: ErrorHandlerService
        }
      : []
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
