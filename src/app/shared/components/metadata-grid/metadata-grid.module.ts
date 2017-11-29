import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Grid2Module } from '../grid2/grid2.module';

import { MetadataGridComponent } from './metadata-grid.component';

@NgModule({
  imports: [
    CommonModule,
    Grid2Module,
  ],
  exports: [
    MetadataGridComponent,
  ],
  declarations: [
    MetadataGridComponent,
  ]
})
export class MetadataGridModule { }
