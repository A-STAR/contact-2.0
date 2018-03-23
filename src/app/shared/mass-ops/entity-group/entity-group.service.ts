import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IEntityGroup } from '../entity-group/entity-group.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class EntityGroupService extends AbstractActionService {
  static MESSAGE_ENTITY_GROUP_SELECTED = 'MESSAGE_ENTITY_GROUP_SELECTED';
  static ACTION_ENTITY_GROUP_ADD = 'objectAddToGroup';

  private url = '/filters/groups?entityTypeIds={entityTypeId}&isManual={isManual}';

  constructor(
    protected actions: Actions,
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  getCanAdd$(entityTypeId: number): Observable<boolean> {
    return this.userPermissionsService.contains('ADD_TO_GROUP_ENTITY_LIST', entityTypeId);
  }

  fetchAll(entityTypeId: number, isManual: boolean = false): Observable<IEntityGroup[]> {
    return this.dataService
      .readAll(this.url, { entityTypeId, isManual: isManual ? 1 : 0 })
      .catch(this.notificationsService.fetchError().entity('entities.entityGroup.gen.plural').dispatchCallback());
  }

  addToGroup(actionParams: IGridAction, groupId: number): Observable<any> {
    return this.dataService
      .create(`/mass/entityType/{entityTypeId}/groups/{groupId}/add`,
        {
          entityTypeId: this.getEntityTypeId(actionParams),
          groupId
        },
        {
          idData: this.actionGridService.buildRequest(actionParams.payload)
        }
      )
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.entityGroup.gen.singular').dispatchCallback());
  }

  getEntityTypeId(actionParams: IGridAction): number {
    return this.actionGridService.getAddOption(actionParams, 'entityTypeId', 0) as number;
  }
}
