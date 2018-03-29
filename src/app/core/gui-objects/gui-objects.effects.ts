import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IGuiObject } from './gui-objects.interface';

import { AuthService } from '../auth/auth.service';
import { DataService } from '../data/data.service';
import { GuiObjectsService } from './gui-objects.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class GuiObjectsEffects {
  @Effect()
  fetchGuiObjects$ = this.actions
    .ofType(GuiObjectsService.GUI_OBJECTS_FETCH)
    .switchMap(() => {
      return this.authService.isRetrievedTokenValid()
        ? this.readGuiObjects()
          .map(guiObjects => ({ type: GuiObjectsService.GUI_OBJECTS_FETCH_SUCCESS, payload: guiObjects }))
          .catch(error => {
            this.router.navigate(['/connection-error']);
            return [
              this.notificationService.fetchError()
                .entity('entities.guiObjects.gen.plural').response(error).action()
            ];
          })
        : of({ type: 'FETCHING_OBJECTS_WHEN_NOT_AUTHORIZED' });
    });

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationsService,
    private router: Router,
  ) {}

  private readGuiObjects(): Observable<IGuiObject[]> {
    return this.dataService.readAll('/guiconfigurations');
  }
}
