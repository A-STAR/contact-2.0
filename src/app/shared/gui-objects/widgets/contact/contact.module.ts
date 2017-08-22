import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactCardModule } from './card/contact-card.module';
import { ContactGridModule } from './grid/contact-grid.module';

import { ContactService } from './contact.service';

@NgModule({
  imports: [
    ContactCardModule,
    ContactGridModule,
    CommonModule,
  ],
  exports: [
    ContactCardModule,
    ContactGridModule,
  ],
  providers: [
    ContactService,
  ]
})
export class ContactModule { }
