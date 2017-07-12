import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import {
  IPermissionsDialogEnum,
  IPermissionRole,
  IPermissionModel,
} from './permissions.interface';
import { IAppState } from '../../../core/state/state.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { PermissionsService } from './permissions.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

@Injectable()
export class PermissionsEffects {

  hideDialogAction = {
    type: PermissionsService.PERMISSION_DIALOG,
    payload: IPermissionsDialogEnum.NONE,
  };

  rolesFetchAction = { type: PermissionsService.ROLE_FETCH };

  rolePermissionFetchAction = { type: PermissionsService.PERMISSION_FETCH };

  @Effect()
  fetchRoles = this.actions
    .ofType(PermissionsService.ROLE_FETCH)
    .switchMap((action: Action) => {
      return this.readRoles()
        .map(response => ({
          type: PermissionsService.ROLE_FETCH_SUCCESS,
          payload: response.roles
        }))
        .catch(() => [
          this.notifications.createErrorAction('roles.roles.api.errors.fetch'),
        ]);
    });

  @Effect()
  createRole$ = this.actions
    .ofType(PermissionsService.ROLE_ADD)
    .switchMap((action: Action) => {
      return this.addRole(action.payload.role)
        .mergeMap(() => [
          this.rolesFetchAction,
          this.hideDialogAction,
        ])
        .catch(() => [
          this.notifications.createErrorAction('roles.roles.api.errors.add'),
        ]);
    });

  @Effect()
  copyRole$ = this.actions
    .ofType(PermissionsService.ROLE_COPY)
    .switchMap((action: Action) => {
      return this.copyRole(action.payload.originalRoleId, action.payload.role)
        .mergeMap(() => [
          this.rolesFetchAction,
          this.hideDialogAction,
        ])
        .catch(() => [
          this.notifications.createErrorAction('roles.roles.api.errors.copy'),
        ]);
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
          this.hideDialogAction,
          this.userPermissionsService.createRefreshAction(),
        ])
        .catch(() => [
          this.notifications.createErrorAction('roles.roles.api.errors.update'),
        ]);
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
          this.hideDialogAction,
          this.userPermissionsService.createRefreshAction(),
        ])
        .catch(() => [
          this.notifications.createErrorAction('roles.roles.api.errors.delete'),
        ]);
    });

  @Effect()
  fetchRolePermissions$ = this.actions
    .ofType(PermissionsService.PERMISSION_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.readPermissions(store.permissions.currentRole.id)
        .map(response => ({
          type: PermissionsService.PERMISSION_FETCH_SUCCESS,
          payload: {
            permissions: response.permits
          }
        }))
        .catch(() => [
          this.notifications.createErrorAction('roles.permissions.api.errors.fetch')
        ]);
    });

  @Effect()
  updatePermission = this.actions
    .ofType(PermissionsService.PERMISSION_UPDATE)
    .map(toPayload)
    .switchMap(payload => {
      const { roleId, permission } = payload;
      return this.update(roleId, permission)
        .mergeMap(() => [
          this.hideDialogAction,
          this.rolePermissionFetchAction,
          this.userPermissionsService.createRefreshAction(),
        ])
        .catch(() => [
          this.notifications.createErrorAction('roles.permissions.api.errors.update'),
        ]);
    });

  @Effect()
  addPermission = this.actions
    .ofType(PermissionsService.PERMISSION_ADD)
    .map(toPayload)
    .switchMap(payload => {
      const { role, permissionIds } = payload;
      return this.add(role, permissionIds)
        .mergeMap(() => [
          this.hideDialogAction,
          this.rolePermissionFetchAction,
          this.userPermissionsService.createRefreshAction(),
        ])
        .catch(() => [
          this.notifications.createErrorAction('roles.permissions.api.errors.create'),
        ]);
    });

  @Effect()
  deletePermission = this.actions
    .ofType(PermissionsService.PERMISSION_DELETE)
    .map(toPayload)
    .switchMap(payload => {
      const { role, permissionId } = payload;
      return this.delete(role, permissionId)
        .mergeMap(() => [
          this.hideDialogAction,
          this.rolePermissionFetchAction,
          this.userPermissionsService.createRefreshAction(),
        ])
        .catch(() => [
          this.notifications.createErrorAction('roles.permissions.api.errors.delete'),
        ]);
    });

  constructor(
    private actions: Actions,
    private store: Store<IAppState>,
    private dataService: DataService,
    private permissionsService: PermissionsService,
    private notifications: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  private readPermissions(roleId: number): Observable<any> {
    return this.dataService.read('/roles/{roleId}/permits', { roleId });
  }

  private add(role: IPermissionRole, permissionIds: number[]): Observable<any> {
    return this.dataService.create(`/roles/{id}/permits`, { id: role.id }, { permitIds: permissionIds });
  }

  private update(roleId: number, permission: IPermissionModel): Observable<any> {
    return this.dataService.update(
      `/roles/{roleId}/permits/{permissionId}`,
      { roleId, permissionId: permission.id },
      permission
    );
  }

  private delete(role: IPermissionRole, permissionId: number): Observable<any> {
    return this.dataService.delete('/roles/{roleId}/permits/{permissionId}', { roleId: role.id, permissionId });
  }

  private readRoles(): Observable<any> {
    return this.dataService.read('/roles');
  }

  private addRole(role: any): Observable<any> {
    return this.dataService.create('/roles', {}, role);
  }

  private copyRole(originalRoleId: number, role: any): Observable<any> {
    return this.dataService.create('/roles/{originalRoleId}/copy', { originalRoleId }, role);
  }

  private updateRole(roleId: number, role: any): Observable<any> {
    return this.dataService.update('/roles/{roleId}', { roleId }, role);
  }

  private deleteRole(roleId: number): Observable<any> {
    return this.dataService.delete('/roles/{roleId}', {roleId});
  }
}
