import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { IGuiObject } from './gui-objects.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { AuthService } from '../auth/auth.service';
import { DataService } from '../data/data.service';
import { GuiObjectsService } from './gui-objects.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class GuiObjectsEffects {
  @Effect()
  fetchGuiObjects$ = this.actions
    .ofType(GuiObjectsService.GUI_OBJECTS_FETCH)
    .switchMap((action: UnsafeAction) => {
      return this.readGuiObjects()
        .map(guiObjects => ({ type: GuiObjectsService.GUI_OBJECTS_FETCH_SUCCESS, payload: guiObjects }))
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

  private readGuiObjects(): Observable<IGuiObject[]> {
    return this.dataService.readAll('/guiconfigurations')
              // todo remove mock
              .map(config => {
                config[2].children.push({
                    children: [],
                    dsc: 'Валюты',
                    id: 40,
                    name: 'currencies',
                    objType: 1
                  });
                return config;
              });
  }
}
