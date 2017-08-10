import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEntityAttribute } from './entity-attributes.interface';

import { DataService } from '../../data/data.service';

@Injectable()
export class EntityAttributesService {
  constructor(private dataService: DataService) {}

  get(id: number): Observable<IEntityAttribute> {
    // TODO(d.maltsev): check response format when the API is ready
    return this.dataService.read('/entityAttributes/{id}', { id });
  }
}
