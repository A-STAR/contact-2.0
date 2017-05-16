import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DatePipe } from '@angular/common';

import { JwtHelper } from 'angular2-jwt';

import { AuthHttpService } from './auth/auth-http.service';
import { AuthService } from './auth/auth.service';
import { MenuService } from './menu/menu.service';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { TranslatorService } from './translator/translator.service';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { UserPermissionsService } from './user/permissions/user-permissions.service';
import { ValueConverterService } from './converter/value/value-converter.service';
import { MapConverterFactoryService } from './converter/map/map-converter-factory.service';

@NgModule({
  imports: [
  ],
  providers: [
    AuthHttpService,
    AuthService,
    ValueConverterService,
    MapConverterFactoryService,
    JwtHelper,
    MenuService,
    SettingsService,
    ThemesService,
    TranslatorService,
    UserPermissionsService,
    DatePipe,
  ],
  exports: [
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
