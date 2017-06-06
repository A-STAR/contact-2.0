import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IPermission } from './permissions.interface';
import { IAppState } from '../state/state.interface';

import { GridService } from '../../shared/components/grid/grid.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PermissionsService } from './permissions.service';

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
        .catch(() => {
          this.notifications.error('Could not fetch permissions');
          return null;
        });
    });

  @Effect() updatePermissions = this.actions
    .ofType(PermissionsService.PERMISSION_UPDATE)
    .switchMap(action => {
      return this.read()
        .map(data => ({
          type: PermissionsService.PERMISSION_UPDATE,
          payload: data
        }))
        .catch(() => {
          this.notifications.error('Could not update the permission');
          return null;
        });
    });

  @Effect() invalidatePermission = this.actions
      .ofType(PermissionsService.PERMISSION_INVALIDATE)
      .switchMap(action => {
        return this.read()
          .map(data => ({
            type: PermissionsService.PERMISSION_FETCH_SUCCESS,
            payload: data
          }));
      });


  @Effect() createPermission = this.actions
    .ofType(PermissionsService.PERMISSION_CREATE)
    .map(action => action.payload)
    .switchMap(params => {
      const { permissionId, permission } = params;
      return this.create(permissionId, permission)
        .map(data => ({
          type: PermissionsService.PERMISSION_FETCH_SUCCESS,
          payload: data
        }))
        .catch(() => {
          this.notifications.error('Could not fetch permissions');
          return null;
        });
    });

  constructor(
    private actions: Actions,
    private store: Store<IAppState>,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  private read(): Observable<IPermission[]> {
    return this.gridService.read('/userpermits');
  }

  private create(permissionId: number, permission: IPermission): Observable<any> {
    return this.gridService.create('/userpermits/{permissionId}/users', { permissionId }, permission);
  }

  private update(permissionId: number, userId: number, permission: IPermission): Observable<any> {
    return this.gridService.update('/userpermits/{permissionId}/users/{userId}', { permissionId, userId }, permission);
  }

  private delete(permissionId: number, userId: number): Observable<any> {
    return this.gridService.delete('/userpermits/{permissionId}/?id={userId}', { permissionId, userId });
  }

}
