import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { EntityTranslationsConstants, IEntityTranslation } from './entity-translations.interface';

import { DataService } from '../../data/data.service';

@Injectable()
export class EntityTranslationsService {

  private API = '/api/entityAttributes/{entityAttributesId}/entities/{entitiesId}';

  constructor(private dataService: DataService) {
  }

  readDictNameTranslations(entityId: string|number): Observable<IEntityTranslation[]> {
    return this.dataService
      .read(this.API, {
        entityAttributesId: EntityTranslationsConstants.SPEC_DICT_NAME,
        entitiesId: entityId
      })
      .map(data => data.translations);
  }

  saveDictNameTranslations(entityId: string | number, translations: IEntityTranslation[]): Observable<any> {
    return this.dataService.update(this.API, {
      entityAttributesId: EntityTranslationsConstants.SPEC_DICT_NAME,
      entitiesId: entityId
    }, {
      translations: translations
    });
  }

  deleteDictNameTranslation(entityId: string|number, languageId: number | Array<number>): Observable<any> {
    const languageIds = Array.isArray(languageId) ? languageId : [ languageId ];

    return this.dataService.delete('/api/entityAttributes/{entityAttributesId}/entities/{entityId}/languages/?id={languageIds}', {
      entityAttributesId: EntityTranslationsConstants.SPEC_DICT_NAME,
      entityId,
      languageIds: languageIds.join(',')
    });
  }
}
