import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { GridsComponent } from './grids.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  declarations: [
    GridsComponent,
  ],
  exports: [
    GridsComponent,
  ]
})
export class GridsModule {}
