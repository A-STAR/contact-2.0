import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { OrganizationsService } from './organizations.service';
import { GridService } from '../../../../shared/components/grid/grid.service';

@Injectable()
export class OrganizationsEffects {

  @Effect()
  fetch$ = this.actions
    .ofType(OrganizationsService.ORGANIZATIONS_FETCH)
    .switchMap(action => {
      return this.read()
        .map(data => ({
          type: OrganizationsService.ORGANIZATIONS_FETCH_SUCCESS,
          payload: data
        }))
        // TODO: action creator
        .catch(() => Observable.of({
          type: 'NOTIFICATION_PUSH',
          payload: {
            notification: {
              message: 'Could not fetch organizations',
              type: 'ERROR'
            }
          }
        }));
    });

  @Effect()
  create$ = this.actions
    .ofType(OrganizationsService.ORGANIZATIONS_CREATE)
    .switchMap(action => {
      const { parentId, organization } = action.payload;
      return this.create(parentId, organization)
        .map(data => ({
          type: OrganizationsService.ORGANIZATIONS_FETCH
        }))
        // TODO: action creator
        .catch(() => Observable.of({
          type: 'NOTIFICATION_PUSH',
          payload: {
            notification: {
              message: 'Could not create organization',
              type: 'ERROR'
            }
          }
        }));
    });

  @Effect()
  update$ = this.actions
    .ofType(OrganizationsService.ORGANIZATIONS_UPDATE)
    .switchMap(action => {
      const { organizationId, organization } = action.payload;
      return this.update(organizationId, organization)
        .map(data => ({
          type: OrganizationsService.ORGANIZATIONS_FETCH,
          payload: {
            organizationId
          }
        }))
        // TODO: action creator
        .catch(() => Observable.of({
          type: 'NOTIFICATION_PUSH',
          payload: {
            notification: {
              message: 'Could not update organization',
              type: 'ERROR'
            }
          }
        }));
    });

  @Effect()
  delete$ = this.actions
    .ofType(OrganizationsService.ORGANIZATIONS_DELETE)
    .switchMap(action => {
      const { organizationId } = action.payload;
      return this.delete(organizationId)
        .map(data => ({
          type: OrganizationsService.ORGANIZATIONS_FETCH,
          payload: {
            organizationId
          }
        }))
        // TODO: action creator
        .catch(() => Observable.of({
          type: 'NOTIFICATION_PUSH',
          payload: {
            notification: {
              message: 'Could not delete organization',
              type: 'ERROR'
            }
          }
        }));
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
  ) {}

  read(): Observable<any> {
    return this.gridService.read('/api/organizations');
  }

  create(parentId: number, organization: any): Observable<any> {
    return this.gridService.create('/api/organizations', {}, { ...organization, parentId });
  }

  update(organizationId: number, organization: any): Observable<any> {
    return this.gridService.update('/api/organizations/{organizationId}', { organizationId }, organization);
  }

  delete(organizationId: number): Observable<any> {
    return this.gridService.delete('/api/organizations/{organizationId}', { organizationId });
  }
}
