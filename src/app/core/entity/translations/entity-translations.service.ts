import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { GridService } from '../../../shared/components/grid/grid.service';
import { EntityTranslationsConstants, IEntityTranslation } from './entity-translations.interface';

@Injectable()
export class EntityTranslationsConstantsService {

  private API = '/entityAttributes/{entityAttributesId}/entities/{entitiesId}';

  constructor(private gridService: GridService) {
  }

  saveDictNameTranslation(translation: IEntityTranslation): Observable<any> {
    return this.gridService.update(this.API, {
      entityAttributesId: EntityTranslationsConstants.SPEC_DICT_NAME,
      entitiesId: EntityTranslationsConstants.SPEC_DICT_NAME
    }, translation);
  }

  saveDictNameTranslations(translations: IEntityTranslation[]): Observable<any> {
    return Observable.forkJoin(translations.map((translation: IEntityTranslation) => this.saveDictNameTranslation(translation)));
  }
}
