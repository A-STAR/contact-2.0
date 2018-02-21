import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { ContactPersonsGridComponent } from './contact-persons-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    ContactPersonsGridComponent,
  ],
  declarations: [
    ContactPersonsGridComponent,
  ],
  entryComponents: [
    ContactPersonsGridComponent,
  ]
})
export class ContactPersonsGridModule { }
