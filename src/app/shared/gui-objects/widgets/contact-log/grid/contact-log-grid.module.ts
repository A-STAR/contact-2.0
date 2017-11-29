import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetadataGridModule } from '../../../../components/metadata-grid/metadata-grid.module';

import { ContactLogGridComponent } from './contact-log-grid.component';

@NgModule({
  imports: [
    CommonModule,
    MetadataGridModule,
  ],
  exports: [
    ContactLogGridComponent,
  ],
  declarations: [
    ContactLogGridComponent,
  ],
})
export class ContactLogGridModule { }
