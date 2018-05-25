import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

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
import { LayoutService } from '@app/core/layout/layout.service';
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
import { Debt, Person, User, Phone } from '@app/entities';

/**
 * NOTE: this is a quick patch that places the operators
 * in the Observable prototype that persist across the app
 * TODO(a.tymchuk, i.kibisov, d.maltsev, i.lobanov): import the lettable operators and pipe them
 * wherever applicable accross the whole codebase
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import { TaskService } from '@app/core/task/task.service';

@NgModule({
  imports: [
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
      urls: [ { url: '/debts/{id}', queryParams: [ 'callCenter' ] }, '/persons/{personId}/debts' ],
    }),
    RepositoryModule.withEntity({
      entityClass: Phone,
      urls: [
        {
          url: '/entityTypes/{entityType}/entities/{entityId}/phones',
          queryParams: [ 'callCenter' ]
        },
        {
          url: '/entityTypes/{entityType}/entities/{entityId}/phones/{phoneId}',
          queryParams: [ 'callCenter' ]
        },
      ],
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
    LayoutService,
    MetadataService,
    NotificationsService,
    PersistenceService,
    SettingsService,
    TaskService,
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
