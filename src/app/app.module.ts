import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToasterModule } from 'angular2-toaster';
import * as R from 'ramda';

import { AuthEffects } from './core/auth/auth.effects';
import { DictionariesEffects } from './core/dictionaries/dictionaries.effects';
import { EntityAttributesEffects } from './core/entity/attributes/entity-attributes.effects';
import { GuiObjectsEffects } from './core/gui-objects/gui-objects.effects';
import { LookupEffects } from './core/lookup/lookup.effects';
import { MetadataEffects } from './core/metadata/metadata.effects';
import { NotificationsEffects } from './core/notifications/notifications.effects';

import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';

import { IAppState } from './core/state/state.interface';
import { AppComponent } from './app.component';

import { AuthService } from './core/auth/auth.service';

import { initialState, reducers } from './core/state/root.reducer';
import { environment } from '../environments/environment';

// https://github.com/ocombe/ng2-translate/issues/218
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function getInitialState(): Partial<IAppState> {
  return { ...initialState };
}

export function authTokenGetter(): string {
  return R.tryCatch(JSON.parse, () => null)(localStorage.getItem(AuthService.TOKEN_NAME));
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    EffectsModule.forRoot([
      AuthEffects,
      DictionariesEffects,
      EntityAttributesEffects,
      GuiObjectsEffects,
      LookupEffects,
      NotificationsEffects,
      MetadataEffects,
    ]),
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: authTokenGetter,
        whitelistedDomains: [
          'localhost:4200',
          'localhost:8080',
          'appservertest.luxbase.int:4100',
          'appservertest.luxbase.int:4300'
        ],
        throwNoTokenError: false
      }
    }),
    LayoutModule,
    RoutesModule,
    SharedModule.forRoot(),
    StoreModule.forRoot(reducers, { initialState: getInitialState }),
    !environment.production
      ? StoreDevtoolsModule.instrument({ maxAge: 1024 })
      : [],
    ToasterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthService,
    JwtHelperService,
  ],
  exports: [
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
