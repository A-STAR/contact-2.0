import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Accordion2ItemModule } from './item/item.module';

import { Accordion2Component } from './accordion-2.component';

@NgModule({
  imports: [
    Accordion2ItemModule,
    CommonModule,
    TranslateModule,
  ],
  exports: [
    Accordion2ItemModule,
    Accordion2Component,
  ],
  declarations: [
    Accordion2Component,
  ]
})
export class Accordion2Module { }
