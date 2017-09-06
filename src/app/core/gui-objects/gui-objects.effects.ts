import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IGuiObjectsResponse } from './gui-objects.interface';

import { AuthService } from '../auth/auth.service';
import { DataService } from '../data/data.service';
import { GuiObjectsService } from './gui-objects.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class GuiObjectsEffects {
  @Effect()
  fetchGuiObjects$ = this.actions
    .ofType(GuiObjectsService.GUI_OBJECTS_FETCH)
    .switchMap((action: Action) => {
      return this.readGuiObjects()
        .map(response => ({ type: GuiObjectsService.GUI_OBJECTS_FETCH_SUCCESS, payload: response }))
        .catch(error => {
          if (error.status === 401) {
            this.authService.redirectToLogin();
          } else {
            this.router.navigate(['/connection-error']);
          }
          return [
            this.notificationService.error('errors.default.read')
              .entity('entities.guiObjects.gen.plural').response(error).action()
          ];
        });
    });

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationsService,
    private router: Router,
  ) {}

  private readGuiObjects(): Observable<IGuiObjectsResponse> {
    return this.dataService.read('/guiconfigurations');
  }
}
