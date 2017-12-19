import { NgModule } from '@angular/core';

import { ContactSelectModule } from '../contact-select/contact-select.module';
import { SharedModule } from '../../../../shared/shared.module';

import { PhoneService } from './phone.service';

import { PhoneComponent } from './phone.component';

@NgModule({
  imports: [
    ContactSelectModule,
    SharedModule,
  ],
  exports: [
    PhoneComponent,
  ],
  declarations: [
    PhoneComponent,
  ],
  providers: [
    PhoneService,
  ]
})
export class PhoneModule {}
