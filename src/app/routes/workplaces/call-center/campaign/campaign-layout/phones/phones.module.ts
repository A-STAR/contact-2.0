import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { PhonesComponent } from './phones.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    PhonesComponent,
  ],
  declarations: [
    PhonesComponent,
  ],
})
export class PhonesModule {}
