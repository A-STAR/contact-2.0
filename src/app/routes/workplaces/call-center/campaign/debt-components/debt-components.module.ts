import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtComponentsComponent } from './debt-components.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    DebtComponentsComponent,
  ],
  declarations: [
    DebtComponentsComponent,
  ],
})
export class DebtComponentsModule {}
