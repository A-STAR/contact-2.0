import { NgModule } from '@angular/core';

import { ContactSelectModule } from '../contact-select/contact-select.module';
import { SharedModule } from '../../../../shared/shared.module';

import { ContactService } from './contact.service';

import { ContactComponent } from './contact.component';

@NgModule({
  imports: [
    ContactSelectModule,
    SharedModule,
  ],
  exports: [
    ContactComponent,
  ],
  declarations: [
    ContactComponent,
  ],
  providers: [
    ContactService,
  ]
})
export class ContactModule {}
