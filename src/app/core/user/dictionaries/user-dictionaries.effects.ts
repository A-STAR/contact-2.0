import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IUserTerm, IUserDictionaryAction } from './user-dictionaries.interface';
import { SafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserDictionariesService } from './user-dictionaries.service';

@Injectable()
export class UserDictionariesEffects {
  @Effect()
  fetchDictionary$ = this.actions
    .ofType(UserDictionariesService.USER_DICTIONARY_FETCH)
    .mergeMap((action: SafeAction<IUserDictionaryAction>) => {
      const { dictionaryId } = action.payload;
      return this.read(dictionaryId)
        .map(terms => {
          return {
            type: UserDictionariesService.USER_DICTIONARY_FETCH_SUCCESS,
            payload: {
              dictionaryId,
              terms: terms.filter(t => !t.isClosed)
            }
          };
        })
        .catch(error => {
          return [
            {
              type: UserDictionariesService.USER_DICTIONARY_FETCH_FAILURE,
              payload: {
                dictionaryId
              }
            },
            this.notificationService.fetchError()
              .entity('entities.user.dictionaries.gen.plural')
              .response(error).action()
          ];
        });
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private read(dictionaryId: number): Observable<IUserTerm[]> {
    return this.dataService.readAll('/lookup/dictionaries/{dictionaryId}/terms', { dictionaryId });
  }
}
