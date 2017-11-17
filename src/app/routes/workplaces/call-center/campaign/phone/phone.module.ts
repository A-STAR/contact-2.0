import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

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
})
export class PhoneModule { }
