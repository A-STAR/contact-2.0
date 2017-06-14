import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import {
  IPermissionsDialogEnum,
  IPermissionsResponse,
  IPermissionRole,
  IPermissionModel,
} from './permissions.interface';
import { IAppState } from '../state/state.interface';

import { GridService } from '../../shared/components/grid/grid.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionsEffects {

  hideDialogAction = {
    type: PermissionsService.PERMISSION_DIALOG,
    payload: IPermissionsDialogEnum.NONE,
  };

  permissionFetchAction = { type: PermissionsService.PERMISSION_FETCH };

  @Effect()
  fetchPermissions = this.actions
    .ofType(PermissionsService.PERMISSION_FETCH)
    .switchMap((action: Action) => {
      return this.read()
        .catch(() => {
          this.notifications.error('permissions.api.errors.fetch');
          return null;
        })
        .map(response => ({
          type: PermissionsService.PERMISSION_FETCH_SUCCESS,
          payload: this.permissionsService.normalizePermissions(response as IPermissionsResponse)
        }));
    });

  @Effect()
  updatePermissions = this.actions
    .ofType(PermissionsService.PERMISSION_UPDATE)
    .map(toPayload)
    .switchMap(payload => {
      const { roleId, permission } = payload;
      return this.update(roleId, permission)
        .catch(() => {
          this.notifications.error('permissions.api.errors.update');
          return null;
        })
        .mergeMap(() => [
          this.hideDialogAction,
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
          this.hideDialogAction,
          this.permissionFetchAction,
        ]);
    });

  @Effect()
  deletePermissions = this.actions
    .ofType(PermissionsService.PERMISSION_DELETE)
    .map(toPayload)
    .switchMap(payload => {
      const { role, permissionId } = payload;
      return this.delete(role, permissionId)
        .catch(() => {
          this.notifications.error('permissions.api.errors.delete');
          return null;
        })
        .mergeMap(() => [
          this.hideDialogAction,
          this.permissionFetchAction,
        ]);
    });

  constructor(
    private actions: Actions,
    private store: Store<IAppState>,
    private gridService: GridService,
    private permissionsService: PermissionsService,
    private notifications: NotificationsService,
  ) {}

  private read(): Observable<IPermissionsResponse> {
    return this.gridService.read('/userpermits');
  }

  private add(role: IPermissionRole, permissionIds: number[]): Observable<any> {
    return this.gridService.create(`/roles/{id}/permits`, { id: role.id } , { permitIds: permissionIds });
  }

  private update(roleId: number, permission: IPermissionModel): Observable<any> {
    return this.gridService.update(
      `/roles/{roleId}/permits/{permissionId}`,
      { roleId, permissionId: permission.id },
      permission
    );
  }

  private delete(role: IPermissionRole, permissionId: number): Observable<any> {
    return this.gridService.delete('/roles/{roleId}/permits/{permissionId}', { roleId: role.id, permissionId });
  }

}
