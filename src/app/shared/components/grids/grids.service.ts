import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ColDef } from 'ag-grid';
import { Observable } from 'rxjs/Observable';
import { mapTo } from 'rxjs/operators';

import { IGridColumn, IGridFilterType } from './grids.interface';
import { IUserDictionaries } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DictRendererComponent } from './renderers/dict/dict.component';
import { LookupRendererComponent } from './renderers/lookup/lookup.component';

@Injectable()
export class GridsService {
  constructor(
    private translateService: TranslateService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  convertColumnsToColDefs<T>(columns: IGridColumn<T>[]): Observable<ColDef[]> {
    const colDefs = columns.map(column => ({
      field: column.prop,
      headerName: this.translateService.instant(column.label),
      minWidth: column.minWidth,
      maxWidth: column.maxWidth,
      ...this.getFilterOptions(column),
      ...this.getCellRendererOptions(column),
    }));

    return this.preloadDictionaries(columns).pipe(
      mapTo(colDefs),
    );
  }

  preloadDictionaries<T>(columns: IGridColumn<T>[]): Observable<IUserDictionaries> {
    // TODO(d.maltsev): remove duplicates
    const dictCodes = columns
      .map(column => column.dictCode)
      .filter(Boolean);
    return this.userDictionariesService.getDictionaries(dictCodes);
  }

  private getCellRendererOptions<T>(column: IGridColumn<T>): Partial<ColDef> {
    const { dictCode, lookupKey, renderer } = column;
    switch (true) {
      case Boolean(renderer):
        return {
          cellRendererFramework: renderer,
        };
      case Boolean(dictCode):
        return {
          cellRendererFramework: DictRendererComponent,
          cellRendererParams: { dictCode },
        };
      case Boolean(lookupKey):
        return {
          cellRendererFramework: LookupRendererComponent,
          cellRendererParams: { lookupKey },
        };
      default:
        return {};
    }
  }

  private getFilterOptions<T>(column: IGridColumn<T>): Partial<ColDef> {
    switch (column.filter) {
      case IGridFilterType.NUMBER:
        return { filter: 'agNumberColumnFilter' };
      case IGridFilterType.TEXT:
        return { filter: 'agTextColumnFilter' };
      case IGridFilterType.DATE:
        return { filter: 'agDateColumnFilter' };
      default:
        return { suppressFilter: true };
    }
  }
}
