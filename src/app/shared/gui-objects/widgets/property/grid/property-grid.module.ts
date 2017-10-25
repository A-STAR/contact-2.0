import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';

import { PropertyGridComponent } from './property-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
  ],
  exports: [
    PropertyGridComponent,
  ],
  declarations: [
    PropertyGridComponent,
  ],
  entryComponents: [
    PropertyGridComponent,
  ]
})
export class PropertyGridModule { }
