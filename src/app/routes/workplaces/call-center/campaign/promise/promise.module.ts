import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { PromiseComponent } from './promise.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    PromiseComponent,
  ],
  declarations: [
    PromiseComponent,
  ],
})
export class PromiseModule {}
