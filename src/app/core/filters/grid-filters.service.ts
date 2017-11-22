import { IPortfolio } from '../../routes/admin/contractors/contractors-and-portfolios.interface';
import { IDictionaryItem } from '../../routes/admin/dictionaries/dictionaries.interface';
import { IEmployee } from '../../routes/admin/actions-log/actions-log.interface';
import { IEntityGroup } from '../../routes/utilities/campaigns/campaigns.interface';
import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GridFiltersService {

  constructor(private dataService: DataService) { }

  fetchPortfolios(statusCodes: number[], directionCodes: number[]): Observable<IPortfolio[]> {
    return this.dataService.readAll(`filters/portfolios?statusCodes={statusCodes}&directionCodes={directionCodes}`, {
      statusCodes,
      directionCodes
    });
  }

  fetchDicts(dictsCode: number[]): Observable<IDictionaryItem[]> {
    return this.dataService.readAll(`filters/dicts/{dictsCode}`, {
      dictsCode
    });
  }

  fetchUsers(isInactive: number): Observable<IEmployee[]> {
    return this.dataService.readAll(`filters/users?isInactive={isInactive}`, {
      isInactive
    });
  }

  fetchEntitiesGroups(entityTypeIds: number[], isManual: number): Observable<IEntityGroup[]> {
    return this.dataService.readAll(`/filters/groups?entityTypeIds={entityTypeIds}&isManual={isManual}`, {
      entityTypeIds,
      isManual
    });
  }
}
