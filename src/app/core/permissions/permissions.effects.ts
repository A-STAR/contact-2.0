import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IPermission } from './permissions.interface';

import { NotificationsService } from '../notifications/notifications.service';
import { PermissionsService } from './permissions.service';
import { GridService } from '../../shared/components/grid/grid.service';

@Injectable()
export class PermissionsEffects {

  @Effect() fetchPermissions = this.actions
    .ofType(PermissionsService.PERMISSION_FETCH)
    .switchMap(action => {
      return this.read()
        .map(data => ({
          type: PermissionsService.PERMISSION_FETCH_SUCCESS,
          payload: data
        }))
        .catch(() => Observable.of({
          type: PermissionsService.PERMISSION_FETCH_ERROR
        }));
    });

  @Effect() updatePermissions = this.actions
    .ofType(PermissionsService.PERMISSION_UPDATE)
    .switchMap(action => {
      return this.read()
        .map(data => ({
          type: PermissionsService.PERMISSION_UPDATE,
          payload: data
        }))
        .catch((error) => {
          this.notifications.error('Could not update the permission');
          return null;
        });
    });

  constructor(
    private actions: Actions,
    private permissionsService: PermissionsService,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  read(): Observable<any> {
    return this.gridService.read('/userpermits');
  }

  create(permissionId: number, permission: IPermission): Observable<any> {
    return this.gridService.create('/userpermits/{permissionId}/users', { permissionId }, permission);
  }

  update(permissionId: number, userId: number, permission: IPermission): Observable<any> {
    return this.gridService.update('/userpermits/{permissionId}/users/{userId}', { permissionId, userId }, permission);
  }

  delete(permissionId: number, userId: number): Observable<any> {
    return this.gridService.delete('/userpermits/{permissionId}/?id={userId}', { permissionId, userId });
  }
}
