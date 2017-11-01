import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AccordionItemModule } from './item/item.module';

import { AccordionComponent } from './accordion.component';

@NgModule({
  imports: [
    AccordionItemModule,
    CommonModule,
    TranslateModule,
  ],
  exports: [
    AccordionItemModule,
    AccordionComponent,
  ],
  declarations: [
    AccordionComponent,
  ]
})
export class AccordionModule { }
