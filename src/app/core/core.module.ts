import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AuthHttpService } from './auth/auth-http.service';
import { AuthService } from './auth/auth.service';
import { MenuService } from './menu/menu.service';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { TranslatorService } from './translator/translator.service';

import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  imports: [
  ],
  providers: [
    AuthHttpService,
    AuthService,
    MenuService,
    SettingsService,
    ThemesService,
    TranslatorService,
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
