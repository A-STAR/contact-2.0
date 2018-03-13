import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkplacesSharedModule } from '../../../shared/shared.module';

import { DocumentsComponent } from './documents.component';

@NgModule({
  imports: [
    CommonModule,
    WorkplacesSharedModule,
  ],
  exports: [
    DocumentsComponent,
  ],
  declarations: [
    DocumentsComponent,
  ],
})
export class DocumentsModule { }
