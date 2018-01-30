import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { PhoneComponent } from './phone.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    PhoneComponent,
  ],
  declarations: [
    PhoneComponent,
  ],
})
export class PhoneModule { }
