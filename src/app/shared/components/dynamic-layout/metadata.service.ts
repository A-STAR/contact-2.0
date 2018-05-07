import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { IDynamicLayoutConfig } from './dynamic-layout.interface';

import { ConfigService } from '@app/core/config/config.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class MetadataService {
  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient,
    private notificationsService: NotificationsService,
  ) {}

  getConfig(key: string): Observable<IDynamicLayoutConfig> {
    const { assets } = this.configService.config;
    return this.httpClient
      .get(`${assets}/forms/${key}.json`)
      .pipe(
        map((config: IDynamicLayoutConfig) => config),
        // TODO(d.maltsev): i18n
        catchError(this.notificationsService.error(`Could not fetch form config by key ${key}`).dispatchCallback()),
      );
  }
}
