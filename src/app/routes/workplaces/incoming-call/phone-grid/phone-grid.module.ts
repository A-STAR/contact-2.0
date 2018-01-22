import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { PhoneGridComponent } from './phone-grid.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  declarations: [
    PhoneGridComponent,
  ],
  exports: [
    PhoneGridComponent,
  ]
})
export class PhoneGridModule {}
