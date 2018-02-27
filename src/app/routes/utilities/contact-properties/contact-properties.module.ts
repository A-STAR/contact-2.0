import { NgModule } from '@angular/core';

import { ContactPropertyTreeModule } from './tree/contact-property-tree.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContactPropertyService } from './contact-properties.service';

@NgModule({
  imports: [
    ContactPropertyTreeModule,
    SharedModule,
  ],
  exports: [
    ContactPropertyTreeModule,
  ],
  providers: [
    ContactPropertyService,
  ]
})
export class ContactPropertiesModule { }
