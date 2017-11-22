import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IFilterDictionary, IFilterGroup, IFilterPortfolio, IFilterUser } from './grid-filters.interface';

import { DataService } from '../data/data.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class GridFiltersService {

  constructor(private dataService: DataService, private notificationsService: NotificationsService) { }

  fetchPortfolios(statusCodes: number[], directionCodes: number[]): Observable<IFilterPortfolio[]> {
    return this.dataService.readAll(`filters/portfolios?statusCodes={statusCodes}&directionCodes={directionCodes}`, {
      statusCodes,
      directionCodes
    })
      .catch(this.notificationsService.fetchError().entity('entities.portfolios.gen.plural').dispatchCallback());
  }

  fetchDicts(dictsCode: number[]): Observable<IFilterDictionary[]> {
    return this.dataService.readAll(`filters/dicts/{dictsCode}`, {
      dictsCode
    })
      .catch(this.notificationsService.fetchError().entity('entities.dictionaries.gen.plural').dispatchCallback());
  }

  fetchUsers(isInactive: number): Observable<IFilterUser[]> {
    return this.dataService.readAll(`filters/users?isInactive={isInactive}`, {
      isInactive
    })
      .catch(this.notificationsService.fetchError().entity('entities.users.gen.plural').dispatchCallback());
  }

  fetchEntitiesGroups(entityTypeIds: number[], isManual: number): Observable<IFilterGroup[]> {
    return this.dataService.readAll(`/filters/groups?entityTypeIds={entityTypeIds}&isManual={isManual}`, {
      entityTypeIds,
      isManual
    })
      .catch(this.notificationsService.fetchError().entity('entities.groups.gen.plural').dispatchCallback());
  }
}
