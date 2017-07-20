import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IMenuApiResponse } from './menu.interface';

import { AuthService } from '../auth/auth.service';
import { DataService } from '../data/data.service';
import { MenuService } from './menu.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class GuiObjectsEffects {
  @Effect()
  fetchGuiObjects$ = this.actions
    .ofType(MenuService.GUI_OBJECTS_FETCH)
    .switchMap((action: Action) => {
      return this.readGuiObjects()
        .map(response => ({ type: MenuService.GUI_OBJECTS_FETCH_SUCCESS, payload: response }))
        .catch(error => {
          if (error.status === 401) {
            this.authService.redirectToLogin();
          } else {
            this.router.navigate(['/connection-error']);
          }
          return [
            { type: MenuService.GUI_OBJECTS_FETCH_FAILURE },
            this.notificationService.error('errors.default.read').entity('entities.guiObjects.gen.plural').response(error).action()
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

  private readGuiObjects(): Observable<IMenuApiResponse> {
    return this.dataService.read('/guiconfigurations');
  }
}
