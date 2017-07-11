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
    return this.readTranslations(entityId, EntityTranslationsConstants.SPEC_DICT_NAME);
  }

  readTermNameTranslations(entityId: string|number): Observable<IEntityTranslation[]> {
    return this.readTranslations(entityId, EntityTranslationsConstants.SPEC_TERM_NAME);
  }

  private readTranslations(entityId: string|number, entityAttributesId: number|string): Observable<IEntityTranslation[]> {
    return this.dataService
      .read(this.API, {
        entityAttributesId: entityAttributesId,
        entitiesId: entityId
      })
      .map(data => data.translations);
  }

  saveDictNameTranslations(entityId: string | number, translations: IEntityTranslation[]): Observable<any> {
    return this.saveTranslations(entityId, translations, EntityTranslationsConstants.SPEC_DICT_NAME);
  }

  saveTermNameTranslations(entityId: string | number, translations: IEntityTranslation[]): Observable<any> {
    return this.saveTranslations(entityId, translations, EntityTranslationsConstants.SPEC_TERM_NAME);
  }

  private saveTranslations(entityId: string | number, translations: IEntityTranslation[], entityAttributesId: number): Observable<any> {
    return this.dataService.update(this.API, {
      entityAttributesId: entityAttributesId,
      entitiesId: entityId
    }, {
      translations: translations
    });
  }

  deleteDictNameTranslation(entityId: string|number, languageId: number | Array<number>): Observable<any> {
    return this.deleteTranslation(entityId, languageId, EntityTranslationsConstants.SPEC_DICT_NAME);
  }

  deleteTermNameTranslation(entityId: string|number, languageId: number | Array<number>): Observable<any> {
    return this.deleteTranslation(entityId, languageId, EntityTranslationsConstants.SPEC_DICT_NAME);
  }

  private deleteTranslation(entityId: string|number, languageId: number | Array<number>, entityAttributesId: number): Observable<any> {
    const languageIds = Array.isArray(languageId) ? languageId : [ languageId ];

    return this.dataService.delete('/api/entityAttributes/{entityAttributesId}/entities/{entityId}/languages/?id={languageIds}', {
      entityAttributesId: entityAttributesId,
      entityId,
      languageIds: languageIds.join(',')
    });
  }
}
