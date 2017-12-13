import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { SelectModule } from '../../../../shared/components/form/select/select.module';

import { OutcomeService } from './outcome.service';

import { OutcomeComponent } from './outcome.component';

@NgModule({
  imports: [
    SelectModule,
    SharedModule,
  ],
  exports: [
    OutcomeComponent,
  ],
  declarations: [
    OutcomeComponent,
  ],
  providers: [
    OutcomeService,
  ]
})
export class OutcomeModule {}
