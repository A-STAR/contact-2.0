import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

import { DocumentCardComponent } from './document-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
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
