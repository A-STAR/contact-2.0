import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactPropertyTreeModule } from './tree/contact-property-tree.module';

import { ContactPropertyService } from './contact-property.service';

@NgModule({
  imports: [
    ContactPropertyTreeModule,
    CommonModule,
  ],
  exports: [
    ContactPropertyTreeModule,
  ],
  providers: [
    ContactPropertyService,
  ]
})
export class ContactPropertyModule { }
