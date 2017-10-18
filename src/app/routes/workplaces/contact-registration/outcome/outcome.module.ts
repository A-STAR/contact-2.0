import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { OutcomeComponent } from './outcome.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    OutcomeComponent,
  ],
  declarations: [
    OutcomeComponent,
  ],
})
export class OutcomeModule {}
