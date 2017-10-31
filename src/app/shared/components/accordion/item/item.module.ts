import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AccordionItemComponent } from './item.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    AccordionItemComponent,
  ],
  declarations: [
    AccordionItemComponent,
  ]
})
export class AccordionItemModule { }
