import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { IDict } from './dict.interface';

@Injectable()
export class DictService {

  constructor(private gridService: GridService) {
  }

  public getDictTypes(): Observable<any> {
    return Observable.of([
      { label: 'Системный', value: 1 },
      { label: 'Общий', value: 2 }
    ]);
  }

  public getDictList(): Observable<any> {
    return this.gridService.read('/api/dictionaries')
      .map(data => data.dictNames.map(dict => ({label: dict.name, value: dict.id})));
  }

  public editDict(dict: IDict, params: any): Observable<any> {
    return this.gridService.update(
      `/api/dict/{id}`,
      {id: dict.id},
      params
    );
  }

  public createDict(params: any): Observable<any> {
    return this.gridService.create(
      '/api/dictionaries',
      params,
      {}
    );
  }

  public removeDict(params: any): Observable<any> {
    return this.gridService.delete(
      `/api/dict`,
      params
    );
  }
}