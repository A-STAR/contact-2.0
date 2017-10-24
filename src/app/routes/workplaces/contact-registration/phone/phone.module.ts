import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { PhoneService } from './phone.service';

import { PhoneComponent } from './phone.component';

@NgModule({
  imports: [
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
