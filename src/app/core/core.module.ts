import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DatePipe } from '@angular/common';

import { JwtHelper } from 'angular2-jwt';
import { TranslateService } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { AuthHttpService } from './auth/auth-http.service';
import { AuthService } from './auth/auth.service';
import { ConstantsService } from './constants/constants.service';
import { EntityTranslationsService } from './entity/translations/entity-translations.service';
import { MenuService } from './menu/menu.service';
import { NotificationsService } from './notifications/notifications.service';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { PermissionsService } from './permissions/permissions.service';
import { ValueConverterService } from './converter/value/value-converter.service';
import { DateConverterService } from './converter/date/date-converter.service';

import { rootReducer } from '../core/state/root.reducer';

@NgModule({
  imports: [
    StoreModule.provideStore(rootReducer),
    environment.production ?
      [] :
      StoreDevtoolsModule.instrumentOnlyWithExtension({
        maxAge: 1024
      })
  ],
  providers: [
    AuthHttpService,
    AuthService,
    DatePipe,
    DateConverterService,
    ConstantsService,
    JwtHelper,
    MenuService,
    NotificationsService,
    SettingsService,
    ThemesService,
    TranslateService,
    PermissionsService,
    ValueConverterService,
    EntityTranslationsService,
  ],
  exports: [
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
