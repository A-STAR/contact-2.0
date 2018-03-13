import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { DocumentCardComponent } from './document-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    DocumentCardComponent,
  ],
  declarations: [
    DocumentCardComponent,
  ],
  entryComponents: [
    DocumentCardComponent,
  ]
})
export class DocumentCardModule { }
