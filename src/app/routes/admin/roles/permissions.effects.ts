import * as R from 'ramda';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';

import { IPermissionRole, IPermissionModel } from './permissions.interface';
import { IAppState } from '../../../core/state/state.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { PermissionsService } from './permissions.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

// TODO(a.tymchuk): separate service for persisting global state?
const savedState = localStorage.getItem(PermissionsService.STORAGE_KEY);

@Injectable()
export class PermissionsEffects {

  rolesFetchAction = { type: PermissionsService.ROLE_FETCH };

  rolePermissionFetchAction = { type: PermissionsService.PERMISSION_FETCH };

  @Effect()
  init$ = defer(() => of({
    type: PermissionsService.ROLE_INIT,
    payload: R.tryCatch(JSON.parse, () => ({}))(savedState || undefined)
  }));

  @Effect()
  fetchRoles = this.actions
    .ofType(PermissionsService.ROLE_FETCH)
    .switchMap(() => {
      return this.readRoles()
        .map(roles => ({
          type: PermissionsService.ROLE_FETCH_SUCCESS,
          payload: roles
        }))
        .catch(this.notifications.fetchError().entity('entities.roles.gen.plural').callback());
    });

  @Effect()
  createRole$ = this.actions
    .ofType(PermissionsService.ROLE_ADD)
    .switchMap((action: UnsafeAction) => {
      return this.addRole(action.payload.role)
        .mergeMap(() => [
          this.rolesFetchAction,
          { type: PermissionsService.ROLE_ADD_SUCCESS },
        ])
        .catch(this.notifications.createError().entity('entities.roles.gen.singular').callback());
    });

  @Effect()
  copyRole$ = this.actions
    .ofType(PermissionsService.ROLE_COPY)
    .switchMap((action: UnsafeAction) => {
      return this.copyRole(action.payload.originalRoleId, action.payload.role)
        .mergeMap(() => [
          this.rolesFetchAction,
          { type: PermissionsService.ROLE_COPY_SUCCESS },
          { type: PermissionsService.ROLE_SELECTED, payload: { role: null } },
          { type: PermissionsService.PERMISSION_CLEAR }
        ])
        .catch(this.notifications.copyError().entity('entities.roles.gen.singular').callback());
    });

  @Effect()
  updateRole$ = this.actions
    .ofType(PermissionsService.ROLE_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [UnsafeAction, IAppState] = data;
      return this.updateRole(store.permissions.currentRole.id, action.payload.role)
        .mergeMap(() => [
          this.rolesFetchAction,
          this.userPermissionsService.createRefreshAction(),
          { type: PermissionsService.ROLE_UPDATE_SUCCESS },
          { type: PermissionsService.ROLE_SELECTED, payload: { role: null } },
          { type: PermissionsService.PERMISSION_CLEAR }
        ])
        .catch(this.notifications.updateError().entity('entities.roles.gen.singular').callback());
    });

  @Effect()
  deleteRole$ = this.actions
    .ofType(PermissionsService.ROLE_DELETE)
    .withLatestFrom(this.store)
    .switchMap(([_, store]) => {
      return this.deleteRole(store.permissions.currentRole.id)
        .mergeMap(() => [
          this.rolesFetchAction,
          this.userPermissionsService.createRefreshAction(),
          { type: PermissionsService.ROLE_DELETE_SUCCESS },
          { type: PermissionsService.ROLE_SELECTED, payload: { role: null } },
          { type: PermissionsService.PERMISSION_CLEAR }
        ])
        .catch(this.notifications.deleteError().entity('entities.roles.gen.singular').callback());
    });

  @Effect()
  fetchRolePermissions$ = this.actions
    .ofType(PermissionsService.PERMISSION_FETCH)
    .withLatestFrom(this.store)
    .switchMap(([_, store]) => {
      return this.readPermissions(store.permissions.currentRole.id)
        .mergeMap(permissions => [
            { type: PermissionsService.PERMISSION_FETCH_SUCCESS, payload: { permissions } },
            { type: PermissionsService.PERMISSION_SELECTED, payload: null }
        ])
        .catch(this.notifications.fetchError().entity('entities.permissions.gen.plural').callback());
    });

  @Effect()
  createPermission = this.actions
    .ofType(PermissionsService.PERMISSION_ADD)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      const { role, permissionIds } = payload;
      return this.add(role, permissionIds)
        .mergeMap(() => [
          this.rolePermissionFetchAction,
          this.userPermissionsService.createRefreshAction(),
          { type: PermissionsService.PERMISSION_ADD_SUCCESS },
        ])
        .catch(this.notifications.createError().entity('entities.permissions.gen.singular').callback());
    });

  @Effect()
  updatePermission = this.actions
    .ofType(PermissionsService.PERMISSION_UPDATE)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      const { roleId, permission } = payload;
      return this.update(roleId, permission)
        .mergeMap(() => [
          this.rolePermissionFetchAction,
          this.userPermissionsService.createRefreshAction(),
          { type: PermissionsService.PERMISSION_UPDATE_SUCCESS },
          { type: PermissionsService.PERMISSION_SELECTED, payload: null }
        ])
        .catch(this.notifications.updateError().entity('entities.permissions.gen.singular').callback());
    });

  @Effect()
  deletePermission = this.actions
    .ofType(PermissionsService.PERMISSION_DELETE)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      const { role, permissionId } = payload;
      return this.delete(role, permissionId)
        .mergeMap(() => [
          this.rolePermissionFetchAction,
          this.userPermissionsService.createRefreshAction(),
          { type: PermissionsService.PERMISSION_DELETE_SUCCESS },
          { type: PermissionsService.PERMISSION_SELECTED, payload: null },
        ])
        .catch(this.notifications.deleteError().entity('entities.permissions.gen.singular').callback());
    });

  constructor(
    private actions: Actions,
    private store: Store<IAppState>,
    private dataService: DataService,
    private notifications: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  private readPermissions(roleId: number): Observable<any> {
    return this.dataService.readAll('/roles/{roleId}/permits', { roleId });
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
    return this.dataService.readAll('/roles');
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
