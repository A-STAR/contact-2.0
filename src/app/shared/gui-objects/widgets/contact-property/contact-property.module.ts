import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactPropertyTreeModule } from './tree/contact-property-tree.module';

@NgModule({
  imports: [
    ContactPropertyTreeModule,
    CommonModule,
  ],
  exports: [
    ContactPropertyTreeModule,
  ]
})
export class ContactPropertyModule { }
