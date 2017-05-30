import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DatePipe } from '@angular/common';

import { JwtHelper } from 'angular2-jwt';
import { TranslateService } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { UserPermissionsResolver } from './user/permissions/user-permissions-resolver.service';
import { AuthHttpService } from './auth/auth-http.service';
import { AuthService } from './auth/auth.service';
import { ConstantsService } from './constants/constants.service';
import { EntityTranslationsService } from './entity/translations/entity-translations.service';
import { MenuService } from './menu/menu.service';
import { NotificationsActions } from './notifications/notifications.actions';
import { NotificationsService } from './notifications/notifications.service';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { UserPermissionsService } from './user/permissions/user-permissions.service';
import { ValueConverterService } from './converter/value/value-converter.service';

import { rootReducer } from '../core/state/root.reducer';

@NgModule({
  imports: [
    StoreModule.provideStore(rootReducer),
    // TODO: remove for production
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 5
    })
  ],
  providers: [
    AuthHttpService,
    AuthService,
    DatePipe,
    ConstantsService,
    JwtHelper,
    MenuService,
    NotificationsActions,
    NotificationsService,
    SettingsService,
    ThemesService,
    TranslateService,
    UserPermissionsService,
    ValueConverterService,
    EntityTranslationsService,
    UserPermissionsResolver,
  ],
  exports: [
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
