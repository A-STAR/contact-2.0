import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../../shared/shared.module';

import { PhoneGridComponent } from './phone-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PhoneGridComponent,
  ],
  declarations: [
    PhoneGridComponent,
  ],
  entryComponents: [
    PhoneGridComponent,
  ]
})
export class PhoneGridModule { }
