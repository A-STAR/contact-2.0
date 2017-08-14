import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionComponent } from './accordion.component';
import { AccordionItemComponent } from './item/accordion-item.component';

@NgModule({
  imports: [
    CommonModule,
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
