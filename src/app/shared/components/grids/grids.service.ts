import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { mapTo } from 'rxjs/operators';
import { ColDef } from 'ag-grid';

import { IGridColumn } from './grids.interface';
import { IUserDictionaries } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DictRendererComponent } from './renderers/dict.component';

@Injectable()
export class GridsService {
  constructor(
    private userDictionariesService: UserDictionariesService,
  ) {}

  convertColumnsToColDefs<T>(columns: IGridColumn<T>[]): Observable<ColDef[]> {
    const colDefs = columns.map(column => ({
      field: column.prop,
      headerName: column.label,
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
    const { dictCode } = column;
    return dictCode
      ? {
          cellRendererFramework: DictRendererComponent,
          cellRendererParams: { dictCode },
        }
      : {};
  }
}
