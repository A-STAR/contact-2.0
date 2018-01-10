import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { Grid2Module } from '../../../../components/grid2/grid2.module';

import { PersonSelectGridComponent } from './person-select-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    Grid2Module,
  ],
  exports: [
    PersonSelectGridComponent,
  ],
  declarations: [
    PersonSelectGridComponent,
  ],
  entryComponents: [
    PersonSelectGridComponent,
  ]
})
export class PersonSelectGridModule { }
