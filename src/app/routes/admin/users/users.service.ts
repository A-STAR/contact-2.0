import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../shared/components/grid/grid.service';
import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';

@Injectable()
export class UsersService {
  constructor(private gridService: GridService) {}

  create(data: any): Observable<any> {
    return this.gridService.create('/api/users', {}, data);
  }

  save(id: number, data: any): Observable<any> {
    return this.gridService.update('/api/users/{id}', { id }, data);
  }

  getLanguages(): Observable<any> {
    return this.gridService.read('/api/userlanguages')
      .map(data => data.languages.map(lang => ({ label: lang.name, value: lang.id })));
  }

  getRoles(): Observable<ILabeledValue[]> {
    return this.gridService.read('/api/roles')
      .map(data => data.roles.map(role => ({ label: role.name, value: role.id })));
  }
}
