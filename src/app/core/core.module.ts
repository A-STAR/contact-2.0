import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { AppModulesModule } from './app-modules/app-modules.module';
import { DebtModule } from './debt/debt.module';
import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { MapLayersModule } from '@app/core/map-providers/layers/map-layers.module';
import { MapProvidersModule } from '@app/core/map-providers/map-providers.module';
import { RepositoryModule } from '@app/core/repository/repository.module';
import { RoutingModule } from './routing/routing.module';
import { UserModule } from './user/user.module';

import { ActionsLogService } from './actions-log/actions-log.service';
import { ButtonService } from './button/button.service';
import { CallService } from './calls/call.service';
import { ConfigService } from '@app/core/config/config.service';
import { ContextService } from './context/context.service';
import { DataService } from './data/data.service';
import { EntityAttributesService } from './entity/attributes/entity-attributes.service';
import { EntityTranslationsService } from './entity/translations/entity-translations.service';
import { ErrorHandlerService } from './error/error-handler.service';
import { GridFiltersService } from './filters/grid-filters.service';
import { GuiObjectsService } from './gui-objects/gui-objects.service';
import { HelpService } from './help/help.service';
import { LookupService } from './lookup/lookup.service';
import { MetadataService } from './metadata/metadata.service';
import { NotificationsService } from './notifications/notifications.service';
import { PersistenceService } from './persistence/persistence.service';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { ValueConverterService } from './converter/value-converter.service';
import { WSService } from './ws/ws.service';

import { throwIfAlreadyLoaded } from './module-import-guard';

import { environment } from '../../environments/environment';
import { Debt, Person, User } from '@app/entities';

@NgModule({
  imports: [
    AppModulesModule,
    DebtModule,
    DynamicLoaderModule.forRoot(),
    MapLayersModule,
    MapProvidersModule,
    RoutingModule,
    RepositoryModule.forRoot(),
    RepositoryModule.withEntity({
      entityClass: User,
      urls: [ '/users/{id}' ],
    }),
    RepositoryModule.withEntity({
      entityClass: Person,
      urls: [ '/persons/{id}' ],
    }),
    RepositoryModule.withEntity({
      entityClass: Debt,
      urls: [ '/debts/{id}', '/persons/{personId}/debts' ],
    }),
    UserModule,
  ],
  providers: [
    ActionsLogService,
    ButtonService,
    CallService,
    ConfigService,
    ContextService,
    DatePipe,
    DataService,
    DecimalPipe,
    EntityAttributesService,
    EntityTranslationsService,
    LookupService,
    GridFiltersService,
    GuiObjectsService,
    HelpService,
    MetadataService,
    NotificationsService,
    PersistenceService,
    SettingsService,
    ThemesService,
    TranslateService,
    ValueConverterService,
    WSService,
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
