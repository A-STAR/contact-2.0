import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToasterModule } from 'angular2-toaster';

import { AuthEffects } from './core/auth/auth.effects';
import { DictionariesEffects } from './core/dictionaries/dictionaries.effects';
import { EntityAttributesEffects } from './core/entity/attributes/entity-attributes.effects';
import { GuiObjectsEffects } from './core/gui-objects/gui-objects.effects';
import { LookupEffects } from './core/lookup/lookup.effects';
import { MetadataEffects } from './core/metadata/metadata.effects';
import { NotificationsEffects } from './core/notifications/notifications.effects';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';

import { reducers } from './core/state/root.reducer';
import { environment } from '../environments/environment';

// https://github.com/ocombe/ng2-translate/issues/218
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
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
    HttpModule,
    LayoutModule,
    RoutesModule,
    SharedModule.forRoot(),
    StoreModule.forRoot(reducers),
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
