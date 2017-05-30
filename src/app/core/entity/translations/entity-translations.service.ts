import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { GridService } from '../../../shared/components/grid/grid.service';
import { EntityTranslationsConstants, IEntityTranslation } from './entity-translations.interface';

@Injectable()
export class EntityTranslationsService {

  private API = '/api/entityAttributes/{entityAttributesId}/entities/{entitiesId}';

  constructor(private gridService: GridService) {
  }

  readDictNameTranslations(entityId: string|number): Observable<IEntityTranslation[]> {
    return this.gridService
      .read(this.API, {
        entityAttributesId: EntityTranslationsConstants.SPEC_DICT_NAME,
        entitiesId: entityId
      })
      .map(data => data.translations);
  }

  saveDictNameTranslations(entityId: string | number, translations: IEntityTranslation[]): Observable<any> {
    return this.gridService.update(this.API, {
      entityAttributesId: EntityTranslationsConstants.SPEC_DICT_NAME,
      entitiesId: entityId
    }, {
      translations: translations
    });
  }

  deleteDictNameTranslation(entityId: string|number, languageId: number): Observable<any> {
    return this.gridService.delete('/entityAttributes/{entityAttributesId}/entities/{entitiesId}/languages/?id={languagesId}', {
      entityAttributesId: EntityTranslationsConstants.SPEC_DICT_NAME,
      entitiesId: entityId,
      languagesId: languageId
    });
  }
}
