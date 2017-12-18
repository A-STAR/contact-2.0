import { NgModule } from '@angular/core';

import { ContactModule } from '../contact/contact-grid.module';
import { SharedModule } from '../../../../shared/shared.module';

import { PhoneService } from './phone.service';

import { PhoneComponent } from './phone.component';

@NgModule({
  imports: [
    ContactModule,
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
