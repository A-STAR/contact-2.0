import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular/main';
import { LicenseManager } from 'ag-grid-enterprise/main';

import { CheckModule } from '@app/shared/components/form/check/check.module';

// Grids
import { SimpleGridComponent } from './grid/grid.component';

// Auxiliary Components
import { CheckboxCellRendererComponent } from './renderers/checkbox.component';

@NgModule({
  imports: [
    // TODO(d.maltsev): list components here?
    AgGridModule.withComponents([]),
    CheckModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    CheckboxCellRendererComponent,
    SimpleGridComponent,
  ],
  declarations: [
    CheckboxCellRendererComponent,
    SimpleGridComponent,
  ],
  // Only auxiliary components created by ag-grid in runtime
  entryComponents: [
    CheckboxCellRendererComponent,
  ]
})
export class GridsModule {
  constructor() {
    // tslint:disable-next-line
    LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Key_Not_for_Production_100Devs2_April_2018__MTUyMjYyMzYwMDAwMA==e8bb27c4f0c9ed34bce6c68b868694f2');
  }
}
