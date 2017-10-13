import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IEntityAttribute } from './entity-attributes.interface';

import { DataService } from '../../data/data.service';
import { EntityAttributesService } from './entity-attributes.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class EntityAttributesEffects {
  @Effect()
  fetchAttributes$ = this.actions
    .ofType(EntityAttributesService.ENTITY_ATTRIBUTE_FETCH)
    .mergeMap((action: Action) => {
      const { id } = action.payload;
      return this.read(id)
        .map(attribute => ({
          type: EntityAttributesService.ENTITY_ATTRIBUTE_FETCH_SUCCESS,
          payload: { id, attribute }
        }))
        .catch(response => [
          { type: EntityAttributesService.ENTITY_ATTRIBUTE_FETCH_FAILURE },
          this.notificationService.error('errors.default.read')
            .entity(`entities.attribute.gen.plural`).response(response).action(),
        ]);
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private read(id: number): Observable<IEntityAttribute> {
    return this.dataService.read('/entityAttributes/{id}', { id });
  }
}
