import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../shared/components/grid/grid.service';

@Injectable()
export class UsersService {
  constructor(private gridService: GridService) {}

  create(data: any): Observable<any> {
    return this.gridService.create('/api/users', {}, data);
  }

  save(data: any): Observable<any> {
    return this.gridService.update('/api/users/{id}', { id: data.id }, data);
  }
}
