import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AgGridModule } from 'ag-grid-angular/main';
import { LicenseManager } from 'ag-grid-enterprise/main';
import { TranslateModule } from '@ngx-translate/core';

import './grid2.patch';

import { ActionDialogModule } from '../dialog/action/action-dialog.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { SelectModule } from '../form/select/select.module';
import { Grid2ColumnFilterModule } from './filter/column/grid2-column-filter.module';

import { GridService } from '../grid/grid.service';

import { Grid2Component } from './grid2.component';

@NgModule({
  imports: [
    CommonModule,
    ToolbarModule,
    TranslateModule,
    ActionDialogModule,
    AgGridModule.withComponents([]),
    SelectModule,
    Grid2ColumnFilterModule,
  ],
  exports: [
    Grid2Component,
  ],
  declarations: [
    Grid2Component,
  ],
  providers: [
    GridService,
  ],
})
export class Grid2Module {
  constructor() {
    LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_for_Production_100Devs19_July_2017__MTUwMDQxODgwMDAwMA==c8fa1c094c7bd76cddf4297f92d5f8da');
  }
}
