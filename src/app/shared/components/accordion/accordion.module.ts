import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AccordionComponent } from './accordion.component';
import { AccordionItemComponent } from './item/accordion-item.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    AccordionComponent,
    AccordionItemComponent,
  ],
  declarations: [
    AccordionComponent,
    AccordionItemComponent,
  ],
  providers: [],
})
export class AccordionModule { }
