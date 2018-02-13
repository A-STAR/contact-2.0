import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CheckModule } from '@app/shared/components/form/check/check.module';

// Grids
import { GridComponent } from './grid/grid.component';

// Auxiliary Components
import { CheckboxCellRendererComponent } from './renderers/checkbox.component';

@NgModule({
  imports: [
    CheckModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    CheckboxCellRendererComponent,
    GridComponent,
  ],
  declarations: [
    CheckboxCellRendererComponent,
    GridComponent,
  ],
  // Only auxiliary components created by ag-grid in runtime
  entryComponents: [
    CheckboxCellRendererComponent,
  ]
})
export class GridsModule {}
