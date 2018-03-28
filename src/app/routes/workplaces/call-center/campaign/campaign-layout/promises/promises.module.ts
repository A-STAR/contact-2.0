import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { PromisesComponent } from './promises.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    PromisesComponent,
  ],
  declarations: [
    PromisesComponent,
  ],
})
export class PromisesModule {}
