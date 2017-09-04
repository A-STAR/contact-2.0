import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPortfolioLogEntry, IPortfolioLogsResponse } from './portfolio-log.interface';

import { DataService } from '../../../../../core/data/data.service';

@Injectable()
export class PortfolioLogService {
  constructor(private dataService: DataService) {}

  read(debtId: number): Observable<Array<IPortfolioLogEntry>> {
    return this.dataService.read('/debts/{debtId}/portfoliolog?directionCodes=1,2', { debtId })
      .map((response: IPortfolioLogsResponse) => response.portfolioLogs);
  }
}
