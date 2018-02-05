import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionGridModule } from '@app/shared/components/action-grid/action-grid.module';

import { ContactLogGridComponent } from './contact-log-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ActionGridModule,
  ],
  exports: [
    ContactLogGridComponent,
  ],
  declarations: [
    ContactLogGridComponent,
  ],
})
export class ContactLogGridModule { }
