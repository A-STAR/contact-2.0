import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { PhonesComponent } from './phones.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PhonesComponent,
  ],
  declarations: [
    PhonesComponent,
  ],
})
export class PhonesModule { }
