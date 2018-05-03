import { Injectable } from '@angular/core';
import { ColDef } from 'ag-grid';
import { TranslateService } from '@ngx-translate/core';

import { IGridColumn } from '@app/shared/components/grids/grids.interface';

import { GridsDefaultsService } from '@app/shared/components/grids/grids-defaults.service';
import { GridsService } from './grids.service';
import { SettingsService } from '@app/core/settings/settings.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { StateTree } from '@app/core/utils/state-tree';

@Injectable()
export class GridsTreeActionService extends GridsService {

  constructor(
    settingsService: SettingsService,
    translateService: TranslateService,
    userDictionariesService: UserDictionariesService,
  ) {
    super(
      settingsService,
      translateService,
      userDictionariesService
    );
   }

  /**
  * @override
  */
   convertColumnsToColDefs<T>(columns: IGridColumn<T>[], persistenceKey: string, defaults?: GridsDefaultsService): ColDef[] {
     const dataKeys = columns.filter(c => c.actionParams).map(column => column.prop);
     const colDefMask = columns.find(c => c.actionParams && !!c.actionParams.mask);

     const stateTree = new StateTree({
      dataKeys,
      mask: colDefMask && colDefMask.actionParams.mask,
      dataToState: colDefMask.actionParams.dataToState
     });

     const colDefs = super.convertColumnsToColDefs(columns, persistenceKey, defaults);
     colDefs
       .filter(col => dataKeys.includes(col.colId as keyof T))
       .forEach(
         c =>
           (c.cellRendererParams = {
             ...c.cellRendererParams,
             stateTree,
           }),
       );
      return colDefs;
  }
}
