import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEntityTranslation } from './entity-translations.interface';

import { DataService } from '../../data/data.service';

@Injectable()
export class EntityTranslationsService {

  constructor(private dataService: DataService) {}

  readTranslations(entityId: string|number, entityAttributesId: number|string): Observable<IEntityTranslation[]> {
    return this.dataService
      .readAll('/entityAttributes/{entityAttributesId}/entities/{entitiesId}', {
        entityAttributesId: entityAttributesId,
        entitiesId: entityId
      });
  }
}
