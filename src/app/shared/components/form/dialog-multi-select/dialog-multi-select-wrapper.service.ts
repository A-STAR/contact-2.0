import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDialogMultiSelectFilterType, IDialogMultiSelectValue } from './dialog-multi-select.interface';
import { IGridColumn } from '../../grid/grid.interface';

import { GridFiltersService } from '../../../../core/filters/grid-filters.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

@Injectable()
export class DialogMultiSelectWrapperService {
  private config = {
    // TODO(d.maltsev): incoming and outgoing portfolios
    portfolios: {
      columnsFrom: [
        { prop: 'id' },
        { prop: 'name' },
        { prop: 'contractorName' },
        { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS },
        { prop: 'stageCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE },
        { prop: 'directionCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION },
        { prop: 'signDate' },
        { prop: 'startWorkDate', renderer: 'dateTimeRenderer' },
        { prop: 'startWorkDate', renderer: 'dateTimeRenderer' },
      ],
      columnsTo: [
        { prop: 'name' },
      ],
      fetchCallback: () => this.gridFiltersService.fetchPortfolios(null, [ 1 ]),
      labelGetter: row => row.name,
      valueGetter: row => row.id,
    },
    users: {
      columnsFrom: [
        { prop: 'id' },
        // TODO(d.maltsev): should be fullName - API not implemented yet
        { prop: 'lastName' },
        { prop: 'organization' },
        { prop: 'position' },
      ],
      columnsTo: [
        // TODO(d.maltsev): should be fullName - API not implemented yet
        { prop: 'lastName' },
      ],
      fetchCallback: () => this.gridFiltersService.fetchUsers(0),
      // TODO(d.maltsev): should be fullName - API not implemented yet
      labelGetter: row => row.lastName,
      valueGetter: row => row.id,
    },
  };

  constructor(
    private gridFiltersService: GridFiltersService,
  ) {}

  getColumnsFrom(key: IDialogMultiSelectFilterType): IGridColumn[] {
    return this.config[key].columnsFrom;
  }

  getColumnsTo(key: IDialogMultiSelectFilterType): IGridColumn[] {
    return this.config[key].columnsTo;
  }

  getFetchCallback(key: IDialogMultiSelectFilterType): () => Observable<any> {
    return this.config[key].fetchCallback;
  }

  getLabelGetter(key: IDialogMultiSelectFilterType): (row: any) => string {
    return this.config[key].labelGetter;
  }

  getValueGetter(key: IDialogMultiSelectFilterType): (row: any) => IDialogMultiSelectValue {
    return this.config[key].valueGetter;
  }
}
