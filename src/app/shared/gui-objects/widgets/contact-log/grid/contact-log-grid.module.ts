import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Grid2Module } from '@app/shared/components/grid2/grid2.module';

import { ContactLogGridComponent } from './contact-log-grid.component';

@NgModule({
  imports: [
    CommonModule,
    Grid2Module,
  ],
  exports: [
    ContactLogGridComponent,
  ],
  declarations: [
    ContactLogGridComponent,
  ],
})
export class ContactLogGridModule { }
