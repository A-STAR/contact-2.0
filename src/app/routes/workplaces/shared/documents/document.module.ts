import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentGridModule } from './grid/document-grid.module';

import { DocumentService } from './document.service';

@NgModule({
  imports: [
    DocumentGridModule,
    CommonModule,
  ],
  exports: [
    DocumentGridModule,
  ],
  providers: [
    DocumentService,
  ]
})
export class DocumentModule { }
