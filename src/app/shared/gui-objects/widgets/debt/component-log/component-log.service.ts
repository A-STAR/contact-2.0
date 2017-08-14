import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IComponentLogEntry, IComponentLogsResponse } from './component-log.interface';

import { DataService } from '../../../../../core/data/data.service';

@Injectable()
export class ComponentLogService {
  constructor(private dataService: DataService) {}

  read(debtId: number): Observable<Array<IComponentLogEntry>> {
    return this.dataService.read('/debts/{debtId}/componentlog', { debtId })
      .map((response: IComponentLogsResponse) => response.componentLogs);
  }
}
