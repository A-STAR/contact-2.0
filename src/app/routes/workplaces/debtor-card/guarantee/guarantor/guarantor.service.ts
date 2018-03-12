import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IGuarantor } from '../guarantee.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { DataService } from '@app/core/data/data.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Injectable()
export class GuarantorService {
  static MESSAGE_GUARANTOR_SAVED = 'MESSAGE_GUARANTOR_SAVED';
  static MESSAGE_GUARANTOR_SELECTED = 'MESSAGE_GUARANTOR_SELECTED';
  static MESSAGE_GUARANTOR_SELECTION_CHANGED = 'MESSAGE_GUARANTOR_SELECTION_CHANGED';
  static MESSAGE_GUARANTEE_CONTRACT_SAVED = 'MESSAGE_GUARANTEE_CONTRACT_SAVED';

  private url = '/persons/search';
  private errSingular = 'entities.guarantors.gen.singular';
  private attrListConstants: { [key: string]: string } = {
    '1' : 'Person.Individual.AdditionalAttribute.List',
    '2' : 'Person.LegalEntity.AdditionalAttribute.List',
    '3' : 'Person.SoleProprietorship.AdditionalAttribute.List',
  };

  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
  ) {}

  makeFilter(searchParams: object, columns: ISimpleGridColumn<IGuarantor>[]): FilterObject {
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
        // TODO(d.maltsev): add type to coulmn interface?
        const operator = operators[column['type']];
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

  fetch(personId: number): Observable<IGuarantor> {
    return this.dataService
      .read('/persons/{personId}', { personId })
      .map(resp => resp || {})
      .catch(this.notificationsService.fetchError().entity(this.errSingular).dispatchCallback());
  }

  create(personId: number): Observable<any> {
    return this.dataService
      .create(this.url, { personId }, { personId })
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }

  fetchAll(filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<IGuarantor>> {
    const request = this.gridService.buildRequest(params, filters);

    return this.dataService.create(this.url, {}, request)
      .catch(this.notificationsService.fetchError().entity('entities.guarantors.gen.plural').dispatchCallback());
  }
}
