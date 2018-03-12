import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IAppState } from '../../../core/state/state.interface';
import { IConstant, IConstantsState } from './constants.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class ConstantsService {
  static STORAGE_KEY = 'state/constants';
  static CONSTANT_SELECT = 'CONSTANT_SELECT';
  static CONSTANT_INIT = 'CONSTANT_INIT';

  private baseUrl = '/constants';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  get state(): Observable<IConstantsState> {
    return this.store.select(state => state.constants)
      .filter(Boolean);
  }

  fetchAll(): Observable<IConstant[]> {
    return this.dataService.readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity('entities.users.gen.plural').dispatchCallback());
  }

  update(constant: Partial<IConstant>): Observable<any> {
    return this.state
      .map(state => state.currentConstant)
      .pipe(first())
      .flatMap(currentConstant => {
        const { id } = currentConstant;
        return this.dataService.update(`${this.baseUrl}/{id}`, { id }, constant)
          .catch(this.notificationsService.updateError().entity('entities.users.gen.plural').dispatchCallback());
      });
  }

  changeSelected(payload: IConstant): void {
    this.store.dispatch({
      type: ConstantsService.CONSTANT_SELECT,
      payload
    });
  }

  serialize(constant: IConstant): Partial<IConstant> {
    const { typeCode, value } = constant;
    const fieldMap: object = {
      1: 'valueN',
      2: 'valueD',
      3: 'valueS',
      4: 'valueB',
      5: 'valueN',
      6: 'valueN'
    };
    const field: string = fieldMap[typeCode];
    const body = { [field]: value };

    if ([1, 4, 5, 6].includes(typeCode)) {
      // convert to a number, including bollean value
      body[field] = Number(value);
    }

    return body;
  }
}
