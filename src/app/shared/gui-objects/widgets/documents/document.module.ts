import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentCardModule } from './card/document-card.module';
import { DocumentGridModule } from './grid/document-grid.module';

import { DocumentService } from './document.service';

@NgModule({
  imports: [
    DocumentCardModule,
    DocumentGridModule,
    CommonModule,
  ],
  exports: [
    DocumentCardModule,
    DocumentGridModule,
  ],
  providers: [
    DocumentService,
  ]
})
export class DocumentModule { }
