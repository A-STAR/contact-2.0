import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IRawPermission, IPermission, IPermissionsDisplayEnum } from './permissions.interface';
import { IAppState } from '../state/state.interface';

import { GridService } from '../../shared/components/grid/grid.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsEffects {

  @Effect() fetchPermissions = this.actions
    .ofType(PermissionsService.PERMISSION_FETCH)
    .switchMap((action: Action) => {
      return this.read()
        .map(permissions => ({
          type: PermissionsService.PERMISSION_FETCH_SUCCESS,
          payload: permissions
        }))
        .catch(() => {
          this.notifications.error('permissions.api.errors.fetch');
          return null;
        });
    });

  @Effect() updatePermissions = this.actions
    .ofType(PermissionsService.PERMISSION_UPDATE)
    .map(action => action.payload)
    .switchMap(params => {
      const { permissionId, userId, permission } = params;
      return this.update(permissionId, userId, permission)
        .catch(() => {
          this.notifications.error('permissions.api.errors.update');
          return null;
        })
        .mergeMap(() => [
          { type: PermissionsService.PERMISSION_FETCH }
        ]);
    });

  @Effect() createPermission = this.actions
    .ofType(PermissionsService.PERMISSION_ADD)
    .map(action => action.payload)
    .switchMap(params => {
      const { role, permissionIds } = params;
      return this.add(role, permissionIds)
        .catch(() => {
          this.notifications.error('permissions.api.errors.create');
          return null;
        })
        .mergeMap(() => [
          {
            type: PermissionsService.PERMISSION_DISPLAY,
            payload: { display: IPermissionsDisplayEnum.NONE, editedPermission: null }
          },
          { type: PermissionsService.PERMISSION_FETCH }
        ]);
    });

  @Effect() deletePermissions = this.actions
    .ofType(PermissionsService.PERMISSION_DELETE)
    .map(action => action.payload)
    .switchMap(params => {
      const { permissionId, userId } = params;
      return this.delete(permissionId, userId)
        .catch(() => {
          this.notifications.error('permissions.api.errors.delete');
          return null;
        })
        .mergeMap(() => [
          {
            type: PermissionsService.PERMISSION_DISPLAY,
            payload: { display: IPermissionsDisplayEnum.NONE, editedPermission: null }
          },
          { type: PermissionsService.PERMISSION_FETCH }
        ]);
    });

  constructor(
    private actions: Actions,
    private store: Store<IAppState>,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  private read(): Observable<IRawPermission[]> {
    return this.gridService.read('/userpermits');
  }

  private add(role: { id: number }, permissionsIds: number[]): Observable<any> {
    return this.gridService.create(`/roles/{id}/permits`, role, { permitIds: permissionsIds });
  }

  private update(permissionId: number, userId: number, permission: IPermission): Observable<any> {
    return this.gridService.update('/userpermits/{permissionId}/users/{userId}', { permissionId, userId }, permission);
  }

  private delete(permissionId: number, userId: number): Observable<any> {
    return this.gridService.delete('/userpermits/{permissionId}/?id={userId}', { permissionId, userId });
  }

}
