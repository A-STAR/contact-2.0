import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AgGridModule } from 'ag-grid-angular/main';
import { TranslateModule } from '@ngx-translate/core';

import { ActionDialogModule } from '../dialog/action/action-dialog.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { SelectModule } from '../form/select/select.module';
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
}
