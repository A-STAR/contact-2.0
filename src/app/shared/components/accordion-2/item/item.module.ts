import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Accordion2ItemComponent } from './item.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    Accordion2ItemComponent,
  ],
  declarations: [
    Accordion2ItemComponent,
  ]
})
export class Accordion2ItemModule { }
