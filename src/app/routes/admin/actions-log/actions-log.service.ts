import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IActionType, IEmployee } from './actions-log.interface';

import { GridService } from '../../../shared/components/grid/grid.service';

@Injectable()
export class ActionsLogService {

  constructor(private gridService: GridService) {
  }

  getActionTypes(): Observable<IActionType[]> {
    // TODO stub
    return new Observable<IActionType[]>(observer => {
      setTimeout(() => {
        observer.next([
          {code: 1, name: 'Change form'},
          {code: 2, name: 'Open form'},
          {code: 3, name: 'Copy form'}
        ]);
        observer.complete();
      }, 1000);
    });
  }

  getCooperators(): Observable<IEmployee[]> {
    // TODO stub
    return new Observable<IEmployee[]>(observer => {
      setTimeout(() => {
        observer.next([
          {
            id: 100,
            lastName: 'Last name 1',
            firstName: 'First name 1',
            middleName: 'Middle name 1',
            position: 'Position 1',
            organization: 'Organization 1'
          },
          {
            id: 200,
            lastName: 'Last name 2',
            firstName: 'First name 2',
            middleName: 'Middle name 2',
            position: 'Position 2',
            organization: 'Organization 2'
          }
        ]);
        observer.complete();
      }, 1000);
    });
  }
}
