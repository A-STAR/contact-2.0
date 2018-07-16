import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
// TODO(d.maltsev): do we need forms?
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular/main';
import { TranslateModule } from '@ngx-translate/core';

import { ActionDialogModule } from '../dialog/action/action-dialog.module';
import { DateTimeModule } from '../form/datetime/datetime.module';
import { EditorsModule } from './editors/editors.module';
import { SelectModule } from '../form/select/select.module';
import { PaginationModule } from './pagination/pagination.module';
import { ToolbarModule } from '@app/shared/components/toolbar/toolbar.module';

import { GridService } from '../grid/grid.service';

import { Grid2Component } from './grid2.component';
import { GridDatePickerComponent } from './datepicker/grid-date-picker.component';

@NgModule({
  imports: [
    ActionDialogModule,
    AgGridModule.withComponents([
      GridDatePickerComponent
    ]),
    CommonModule,
    DateTimeModule,
    EditorsModule,
    FormsModule,
    PaginationModule,
    SelectModule,
    ToolbarModule,
    TranslateModule,
  ],
  exports: [
    Grid2Component,
  ],
  declarations: [
    Grid2Component,
    GridDatePickerComponent,
  ],
  providers: [
    GridService,
  ],
})
export class Grid2Module {}
