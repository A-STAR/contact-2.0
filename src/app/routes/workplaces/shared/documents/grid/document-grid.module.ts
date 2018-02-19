import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { DocumentGridComponent } from './document-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    DocumentGridComponent,
  ],
  declarations: [
    DocumentGridComponent,
  ],
  entryComponents: [
    DocumentGridComponent,
  ]
})
export class DocumentGridModule { }
