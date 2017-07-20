import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IMenuApiResponse } from './menu.interface';

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
        .catch(() => [
          { type: MenuService.GUI_OBJECTS_FETCH_FAILURE },
          // TODO(d.maltsev): i18n
          this.notificationService.error('errors.default.read').entity('GUI_OBJECTS').action()
        ]);
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private readGuiObjects(): Observable<IMenuApiResponse> {
    return this.dataService.read('/guiconfigurations');
  }
}
