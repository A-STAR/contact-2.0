import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EntityTranslationsConstants, IEntityTranslation } from './entity-translations.interface';

import { DataService } from '../../data/data.service';

@Injectable()
export class EntityTranslationsService {

  constructor(private dataService: DataService) {}

  readDictNameTranslations(entityId: string|number): Observable<IEntityTranslation[]> {
    return this.readTranslations(entityId, EntityTranslationsConstants.SPEC_DICT_NAME);
  }

  readTermNameTranslations(entityId: string|number): Observable<IEntityTranslation[]> {
    return this.readTranslations(entityId, EntityTranslationsConstants.SPEC_TERM_NAME);
  }

  readAttributeNameTranslations(entityId: string|number): Observable<IEntityTranslation[]> {
    return this.readTranslations(entityId, EntityTranslationsConstants.SPEC_ATTRIBUTE_NAME);
  }

  readContactTreeNodeTranslations(entityId: string|number): Observable<IEntityTranslation[]> {
    return this.readTranslations(entityId, EntityTranslationsConstants.SPEC_CONTACT_TREE_NAME);
  }

  private readTranslations(entityId: string|number, entityAttributesId: number|string): Observable<IEntityTranslation[]> {
    return this.dataService
      .readAll('/entityAttributes/{entityAttributesId}/entities/{entitiesId}', {
        entityAttributesId: entityAttributesId,
        entitiesId: entityId
      });
  }
}
