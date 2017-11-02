import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';
import { IPledger } from './pledger.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';

import { DataService } from '../../../../core/data/data.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

import { FilterObject } from '../../../components/grid2/filter/grid-filter';

@Injectable()
export class PledgerService {
  static MESSAGE_PLEDGER_SELECTION_CHANGED = 'MESSAGE_PLEDGER_SELECTION_CHANGED';

  private url = '/persons/search';
  private attrListConstants: { [key: string]: string } = {
    '1' : 'Person.Individual.AdditionalAttribute.List',
    '2' : 'Person.LegalEntity.AdditionalAttribute.List',
    '3' : 'Person.SoleProprietorship.AdditionalAttribute.List',
  };

  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
  ) { }

  makeFilter(searchParams: object, columns: IGridColumn[]): FilterObject {
    const filter = FilterObject.create().and();
    const makeLike = str => `%${str}%`;
    const operators = {
      'string': 'LIKE',
      'number': '==',
      'boolean': '==',
      'date': '==',
      'datetime': '==',
    };
    Object.keys(searchParams)
      .filter(param => searchParams[param] !== null)
      .forEach(param => {
        const column = columns.find(col => col.prop === param);
        const operator = operators[column.type];
        const value = searchParams[param];
        filter.addFilter(
          FilterObject.create()
            .setName(param)
            .setOperator(operator)
            .setValues(operator === 'LIKE' ? makeLike(value) : value)
        );
      });
    return filter;
  }

  getAttributeConstant(typeCode: number): string {
    return this.attrListConstants[typeCode];
  }

  isPerson(pledgerTypeCode: number): boolean {
    return pledgerTypeCode === 1;
  }

  fetchAll(filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<IPledger>> {
    const request = this.gridService.buildRequest(params, filters);

    return this.dataService.create(this.url, {}, request)
      .catch(this.notificationsService.fetchError().entity('entities.pledgers.gen.plural').dispatchCallback());
  }
}
