import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { PropertyGridComponent } from './property-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PropertyGridComponent,
  ],
  declarations: [
    PropertyGridComponent,
  ]
})
export class PropertyGridModule {}
