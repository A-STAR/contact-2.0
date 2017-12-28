import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IEntityAttribute } from './entity-attributes.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../data/data.service';
import { EntityAttributesService } from './entity-attributes.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class EntityAttributesEffects {
  @Effect()
  fetchAttributes$ = this.actions
    .ofType(EntityAttributesService.ENTITY_ATTRIBUTE_FETCH)
    .mergeMap((action: UnsafeAction) => {
      const { ids } = action.payload;
      return this.readAll(ids)
        .map(attributes => ({
          type: EntityAttributesService.ENTITY_ATTRIBUTE_FETCH_SUCCESS,
          payload: attributes
        }))
        .catch(response => [
          { type: EntityAttributesService.ENTITY_ATTRIBUTE_FETCH_FAILURE, payload: ids },
          this.notificationService.fetchError()
            .entity(`entities.attribute.gen.plural`).response(response).action(),
        ]);
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private readAll(ids: number[]): Observable<IEntityAttribute[]> {
    return this.dataService.readAll('/entityAttributes?ids={ids}', { ids });
  }
}
