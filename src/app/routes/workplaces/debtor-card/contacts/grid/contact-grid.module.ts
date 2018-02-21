import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { ContactGridComponent } from './contact-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    ContactGridComponent,
  ],
  declarations: [
    ContactGridComponent,
  ],
  entryComponents: [
    ContactGridComponent,
  ]
})
export class ContactGridModule { }
