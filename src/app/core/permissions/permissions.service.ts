import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../core/state/state.interface';
import { IPermission, IPermissionsResponse, IPermissionsState } from './permissions.interface';

import { GridService } from '../../shared/components/grid/grid.service';

@Injectable()
export class PermissionsService {
  static STORAGE_KEY = 'state/permissions';
  // store actions
  static PERMISSION_FETCH = 'PERMISSION_FETCH';
  static PERMISSION_FETCH_SUCCESS = 'PERMISSION_FETCH_SUCCESS';
  static PERMISSION_CREATE = 'PERMISSION_CREATE';
  static PERMISSION_UPDATE = 'PERMISSION_UPDATE';
  static PERMISSION_DELETE = 'PERMISSION_DELETE';
  static PERMISSION_INVALIDATE = 'PERMISSION_INVALIDATE';
  // TODO(a.tymchuk): remove for production
  private userPermissions = {
    ACTION_LOG_VIEW: true,
    CONST_VALUE_EDIT: true,
    CONST_VALUE_VIEW: true,
    DICT_ADD: true,
    DICT_DELETE: true,
    DICT_EDIT: true,
    DICT_TERM_ADD: true,
    DICT_TERM_DELETE: true,
    DICT_TERM_EDIT: true,
    DICT_TERM_VIEW: true,
    DICT_VIEW: true,
    GUI_TREE_EDIT: true,
    GUI_TREE_VIEW: true,
    ORGANIZATION_ADD: true,
    ORGANIZATION_DELETE: true,
    ORGANIZATION_EDIT: true,
    ORGANIZATION_VIEW: true,
    PERMIT_ADD: true,
    PERMIT_DELETE: true,
    PERMIT_EDIT: true,
    PERMIT_VIEW: true,
    ROLE_ADD: true,
    ROLE_COPY: true,
    ROLE_DELETE: true,
    ROLE_EDIT: true,
    ROLE_VIEW: true,
    TEST_DUMMY_PERMIT_BOOLEAN: true,
    USER_ADD: true,
    USER_EDIT: true,
    USER_ROLE_EDIT: true,
    USER_VIEW: true,
  };

  constructor(
    private gridService: GridService,
    private store: Store<IAppState>,
  ) { }

  get state(): Observable<IPermissionsState> {
    return this.store.select(state => state.permissions);
  }

  resolvePermissions(forceReload?: boolean): Observable<IPermissionsState> {

    // if (Object.keys(this.userPermissions).length && !forceReload) {
    //   return Observable.of(this.userPermissions);
    // }

    return this.gridService.read('/api/userpermits')
      .map((response: IPermissionsResponse) => {
        return response.userPermits.reduce((acc, userPermission: IPermission) => {
          acc[userPermission.name] = this.toPermissionValue(userPermission);
          return acc;
        }, {});
      })
      .do(payload => this.store.dispatch({ type: PermissionsService.PERMISSION_FETCH_SUCCESS, payload }));
  }

  hasOnePermission(permissionNames: string | Array<string>): boolean {
    const permissions = Array.isArray(permissionNames) ? permissionNames : [ permissionNames ];
    return permissions.reduce((acc, permission) => {
      return acc || !!this.userPermissions[permission];
    }, false);
  }

  hasPermission2(permissionName: string | Array<string>): Observable<boolean> {
    if (Array.isArray(permissionName)) {
      return this.state.map(permissions => {
        return permissionName.reduce((acc, permission) => {
          return acc && permissions[permission];
        }, false);
      });
    }
    // can be undefined
    return this.state.map(permissions => !!permissions[permissionName]);
  }

  hasAllPermissions(permissionNames: Array<string>): boolean {
    return permissionNames.reduce((acc, permission) => {
      return acc && this.userPermissions[permission];
    }, false);
  }

  toPermissionValue(userPermission: IPermission): boolean {
    return (userPermission.valueB !== null) ? userPermission.valueB : false;
  }

  addPermission(permission: string): void {
    this.store.dispatch({
      type: PermissionsService.PERMISSION_CREATE,
      payload: permission,
    });
  }
}
