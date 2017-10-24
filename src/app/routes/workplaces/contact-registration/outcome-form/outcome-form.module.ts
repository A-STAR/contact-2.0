import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { OutcomeFormComponent } from './outcome-form.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    OutcomeFormComponent,
  ],
  declarations: [
    OutcomeFormComponent,
  ],
})
export class OutcomeFormModule {}
