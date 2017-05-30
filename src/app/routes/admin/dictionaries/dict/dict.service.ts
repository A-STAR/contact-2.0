import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../../shared/components/grid/grid.service';

@Injectable()
export class DictService {

  constructor(private gridService: GridService) {
  }

  public removeDict(params: any): Observable<any> {
    return this.gridService.delete(
      `/api/dict`,
      params
    );
  }
}
