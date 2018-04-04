import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridSelectFilterType, IGridSelectValue } from './grid-select.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { GridFiltersService } from '@app/core/filters/grid-filters.service';
import { LookupService } from '@app/core/lookup/lookup.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DateTimeRendererComponent } from '@app/shared/components/grids/renderers/datetime/datetime.component';

import { addGridLabel } from '@app/core/utils';

@Injectable()
export class GridSelectService {
  private readonly config = {
    entityGroups: {
      gridColumns: [
        { prop: 'id' },
        { prop: 'name' },
      ].map(addGridLabel('default.filters.entityGroups.grid')),
      fetchCallback: ({entityTypeId, isManual}) => this.gridFiltersService.fetchEntitiesGroups(entityTypeId, isManual),
      // title: 'default.filters.entityGroups.title',
      labelGetter: row => row.name,
      valueGetter: row => row.id,
    },
    portfolios: {
      gridColumns: [
        { prop: 'id', maxWidth: 70 },
        { prop: 'name' },
        { prop: 'contractorName' },
        { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS },
        { prop: 'stageCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE },
        { prop: 'directionCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION },
        { prop: 'signDate' },
        { prop: 'startWorkDate', renderer: DateTimeRendererComponent },
        { prop: 'endWorkDate', renderer: DateTimeRendererComponent },
      ].map(addGridLabel('default.filters.portfolios.grid')),
      fetchCallback: () => this.lookupService.portfolios,
      labelGetter: row => row.name,
      valueGetter: row => row.id,
    },
  };

  constructor(
    private gridFiltersService: GridFiltersService,
    private lookupService: LookupService,
  ) {}

  getGridColumns(key: IGridSelectFilterType): ISimpleGridColumn<any>[] {
    return this.config[key].gridColumns;
  }

  getFetchCallback(key: IGridSelectFilterType): (filterParams: any) => Observable<any> {
    return this.config[key].fetchCallback;
  }

  getLabelGetter(key: IGridSelectFilterType): (row: any) => string {
    return this.config[key].labelGetter;
  }

  getValueGetter(key: IGridSelectFilterType): (row: any) => IGridSelectValue {
    return this.config[key].valueGetter;
  }

}
