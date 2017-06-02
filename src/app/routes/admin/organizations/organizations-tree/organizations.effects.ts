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
              message: 'Could not fetch users',
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

  save(organizationId: number, organization: any): Observable<any> {
    return this.gridService.update('/api/organizations/{organizationId}', { organizationId }, organization);
  }

  remove(organizationId: number): Observable<any> {
    return this.gridService.delete('/api/organizations/{organizationId}', { organizationId });
  }
}
