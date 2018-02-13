import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular/main';
import { LicenseManager } from 'ag-grid-enterprise/main';

import { CheckModule } from '@app/shared/components/form/check/check.module';

import { GridsService } from './grids.service';

// Grids
import { SimpleGridComponent } from './grid/grid.component';

// Auxiliary Components
import { CheckboxCellRendererComponent } from './renderers/checkbox/checkbox.component';
import { DictRendererComponent } from './renderers/dict/dict.component';

@NgModule({
  imports: [
    AgGridModule.withComponents([
      CheckboxCellRendererComponent,
      DictRendererComponent,
    ]),
    CheckModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    CheckboxCellRendererComponent,
    DictRendererComponent,
    SimpleGridComponent,
  ],
  declarations: [
    CheckboxCellRendererComponent,
    DictRendererComponent,
    SimpleGridComponent,
  ],
  providers: [
    GridsService,
  ]
})
export class GridsModule {
  constructor() {
    // tslint:disable-next-line
    LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Key_Not_for_Production_100Devs2_April_2018__MTUyMjYyMzYwMDAwMA==e8bb27c4f0c9ed34bce6c68b868694f2');
  }
}
