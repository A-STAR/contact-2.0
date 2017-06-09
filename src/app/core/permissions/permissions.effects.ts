import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import {
  IRawPermission,
  IPermissionsDisplayEnum,
  IPermissionRole,
  IPermissionModel,
} from './permissions.interface';
import { IAppState } from '../state/state.interface';

import { GridService } from '../../shared/components/grid/grid.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsEffects {

  hideActionFormAction = {
    type: PermissionsService.PERMISSION_DISPLAY,
    payload: { display: IPermissionsDisplayEnum.NONE, editedPermission: null }
  };

  permissionFetchAction = { type: PermissionsService.PERMISSION_FETCH };

  @Effect()
  fetchPermissions = this.actions
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

  @Effect()
  updatePermissions = this.actions
    .ofType(PermissionsService.PERMISSION_UPDATE)
    .map(toPayload)
    .switchMap(payload => {
      const { roleId, permissionId, permission } = payload;
      return this.update(roleId, permissionId, permission)
        .catch(() => {
          this.notifications.error('permissions.api.errors.update');
          return null;
        })
        .mergeMap(() => [
          this.hideActionFormAction,
          this.permissionFetchAction,
        ]);
    });

  @Effect()
  addPermission = this.actions
    .ofType(PermissionsService.PERMISSION_ADD)
    .map(toPayload)
    .switchMap(payload => {
      const { role, permissionIds } = payload;
      return this.add(role, permissionIds)
        .catch(() => {
          this.notifications.error('permissions.api.errors.create');
          return null;
        })
        .mergeMap(() => [
          this.hideActionFormAction,
          this.permissionFetchAction,
        ]);
    });

  @Effect()
  deletePermissions = this.actions
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
          this.hideActionFormAction,
          this.permissionFetchAction,
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

  private add(role: IPermissionRole, permissionIds: number[]): Observable<any> {
    return this.gridService.create(`/roles/{id}/permits`, role, { permitIds: permissionIds });
  }

  // private update(role: IPermissionRole, permissionId: number, permission: IPermissionModel): Observable<any> {
  //   return this.gridService.update( '/roles/{id}/permits/{permissionId}', { id: role.id, permissionId: permissionId }, permission);
  // }

  private update(roleId: number, permissionId: number, permission: IPermissionModel): Observable<any> {
    return this.gridService.update(
      `/roles/{roleId}/permits/{permissionId}`,
      { roleId, permissionId },
      permission
    );
  }

  private delete(permissionId: number, userId: number): Observable<any> {
    return this.gridService.delete('/userpermits/{permissionId}/?id={userId}', { permissionId, userId });
  }

}
