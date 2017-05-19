import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { IDict } from './dict.interface';

@Injectable()
export class DictService {

  constructor(private gridService: GridService) {
  }

  public getDictList(): Observable<any> {
    return this.gridService.read('/api/dict/list')
      .map(data => data.dictList.map(dict => ({label: dict.name, value: dict.id})));
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
      `/api/dict`,
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
