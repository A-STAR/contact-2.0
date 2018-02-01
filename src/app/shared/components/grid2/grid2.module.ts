import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
// TODO(d.maltsev): do we need this???
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular/main';
import { LicenseManager } from 'ag-grid-enterprise/main';
import { TranslateModule } from '@ngx-translate/core';

import { ActionDialogModule } from '../dialog/action/action-dialog.module';
import { DateTimeModule } from '../form/datetime/datetime.module';
import { EditorsModule } from './editors/editors.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { SelectModule } from '../form/select/select.module';

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
export class Grid2Module {
  constructor() {
    // tslint:disable-next-line
    LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_For_Production_1Devs20_January_2018__MTUxNjQwNjQwMDAwMA==4091ca44a0ac9c86778d044f42c5edc1');
  }
}
