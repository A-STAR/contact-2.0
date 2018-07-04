import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, first } from 'rxjs/operators';

import { IAppState } from '@app/core/state/state.interface';
import { IConstant, IConstantsState } from './constants.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class ConstantsService {
  static STORAGE_KEY = 'state/constants';
  static CONSTANT_SELECT = 'CONSTANT_SELECT';
  static CONSTANT_INIT = 'CONSTANT_INIT';

  private baseUrl = '/constants';

  readonly state: Observable<IConstantsState> = this.store
    .select(state => state.constants)
    .pipe(filter(Boolean));

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

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

    if ([4, 6].includes(typeCode)) {
      // convert to a number, including boolean value
      body[field] = Number(value);
    }

    return body;
  }
}
