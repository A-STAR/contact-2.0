import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IComponentLogEntry } from './component-log.interface';

import { DataService } from '@app/core/data/data.service';

@Injectable()
export class ComponentLogService {
  constructor(private dataService: DataService) {}

  readAll(debtId: number): Observable<IComponentLogEntry[]> {
    return this.dataService.readAll('/debts/{debtId}/componentlog', { debtId });
  }
}
