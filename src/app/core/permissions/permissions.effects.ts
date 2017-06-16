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

  rolesFetchAction = { type: PermissionsService.ROLE_FETCH };

  permissionFetchAction = { type: PermissionsService.PERMISSION_FETCH };

  @Effect()
  fetchRoles = this.actions
    .ofType(PermissionsService.ROLE_FETCH)
    .switchMap((action: Action) => {
      return this.readRoles()
        .catch(() => {
          this.notifications.error('roles.roles.api.errors.fetch');
          return null;
        })
        .map(response => ({
          type: PermissionsService.ROLE_FETCH_SUCCESS,
          payload: response.roles
        }));
    });

  @Effect()
  createRole$ = this.actions
    .ofType(PermissionsService.ROLE_ADD)
    .switchMap((action: Action) => {
      return this.addRole(action.payload.role)
        .mergeMap(() => [
          this.rolesFetchAction,
          this.hideDialogAction
        ])
        .catch(() => {
          this.notifications.error('roles.roles.api.errors.add');
          return null;
        });
    });

  @Effect()
  copyRole$ = this.actions
    .ofType(PermissionsService.ROLE_COPY)
    .switchMap((action: Action) => {
      return this.copyRole(action.payload.originalRoleId, action.payload.role)
        .mergeMap(() => [
          this.rolesFetchAction,
          this.hideDialogAction
        ])
        .catch(() => {
          this.notifications.error('roles.roles.api.errors.copy');
          return null;
        });
    });

  @Effect()
  updateRole$ = this.actions
    .ofType(PermissionsService.ROLE_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.updateRole(store.permissions.currentRole.id, action.payload.role)
        .mergeMap(() => [
          this.rolesFetchAction,
          this.hideDialogAction
        ])
        .catch(() => {
          this.notifications.error('roles.roles.api.errors.update');
          return null;
        });
    });

  @Effect()
  deleteRole$ = this.actions
    .ofType(PermissionsService.ROLE_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.deleteRole(store.permissions.currentRole.id)
        .mergeMap(() => [
          this.rolesFetchAction,
          this.hideDialogAction
        ])
        .catch(() => {
          this.notifications.error('roles.roles.api.errors.delete');
          return null;
        });
    });

  @Effect()
  selectRole$ = this.actions
    .ofType(PermissionsService.ROLE_SELECTED)
    .map(action => ({
      type: action.payload.role ? PermissionsService.ROLE_PERMISSION_FETCH : PermissionsService.PERMISSION_CLEAR
    }));

  @Effect()
  fetchPermissions = this.actions
    .ofType(PermissionsService.PERMISSION_FETCH)
    .switchMap((action: Action) => {
      return this.read()
        .catch(() => {
          this.notifications.error('roles.permissions.api.errors.fetch');
          return null;
        })
        .map(response => ({
          type: PermissionsService.PERMISSION_FETCH_SUCCESS,
          payload: this.permissionsService.normalizePermissions(response as IPermissionsResponse)
        }));
    });

  @Effect()
  fetchRolePermissions$ = this.actions
    .ofType(PermissionsService.ROLE_PERMISSION_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.readPermissions(store.permissions.currentRole.id)
        .map(response => ({
          type: PermissionsService.ROLE_PERMISSION_FETCH_SUCCESS,
          payload: {
            permissions: response.permits
          }
        }))
        .catch(() => {
          this.notifications.error('roles.permissions.api.errors.fetch');
          return null;
        });
    });

  @Effect()
  updatePermissions = this.actions
    .ofType(PermissionsService.PERMISSION_UPDATE)
    .map(toPayload)
    .switchMap(payload => {
      const { roleId, permission } = payload;
      return this.update(roleId, permission)
        .catch(() => {
          this.notifications.error('roles.permissions.api.errors.update');
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
          this.notifications.error('roles.permissions.api.errors.create');
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
          this.notifications.error('roles.permissions.api.errors.delete');
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

  private readPermissions(roleId: number): Observable<any> {
    return this.gridService.read('/roles/{roleId}/permits', { roleId });
  }

  private add(role: IPermissionRole, permissionIds: number[]): Observable<any> {
    return this.gridService.create(`/roles/{id}/permits`, { id: role.id }, { permitIds: permissionIds });
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

  private readRoles(): Observable<any> {
    return this.gridService.read('/roles');
  }

  private addRole(role: any): Observable<any> {
    return this.gridService.create('/roles', {}, role);
  }

  private copyRole(originalRoleId: number, role: any): Observable<any> {
    return this.gridService.create('/roles/{originalRoleId}/copy', { originalRoleId }, role);
  }

  private updateRole(roleId: number, role: any): Observable<any> {
    return this.gridService.update('/roles/{roleId}', { roleId }, role);
  }

  private deleteRole(roleId: number): Observable<any> {
    return this.gridService.delete('/roles/{roleId}', {roleId});
  }
}
