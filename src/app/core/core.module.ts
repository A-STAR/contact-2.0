import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { AppModulesModule } from './app-modules/app-modules.module';
import { DebtModule } from './debt/debt.module';
import { UserModule } from './user/user.module';

import { ActionsLogService } from './actions-log/actions-log.service';
import { DataService } from './data/data.service';
import { EntityAttributesService } from './entity/attributes/entity-attributes.service';
import { EntityTranslationsService } from './entity/translations/entity-translations.service';
import { ErrorHandlerService } from './error/error-handler.service';
import { GridFiltersService } from './filters/grid-filters.service';
import { GuiObjectsService } from './gui-objects/gui-objects.service';
import { LookupService } from './lookup/lookup.service';
import { MessageBusService } from './message-bus/message-bus.service';
import { MetadataService } from './metadata/metadata.service';
import { NotificationsService } from './notifications/notifications.service';
import { PersistenceService } from './persistence/persistence.service';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { ValueConverterService } from './converter/value-converter.service';

import { throwIfAlreadyLoaded } from './module-import-guard';

import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    AppModulesModule,
    DebtModule,
    UserModule,
  ],
  providers: [
    ActionsLogService,
    EntityAttributesService,
    EntityTranslationsService,
    DatePipe,
    DataService,
    LookupService,
    GridFiltersService,
    GuiObjectsService,
    MessageBusService,
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
