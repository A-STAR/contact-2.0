import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorActionLogComponent } from './action-log.component';
import { ActionLogService } from './action-log.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorActionLogComponent
  ],
  declarations: [
    DebtorActionLogComponent
  ],
  providers: [
    ActionLogService,
  ],
})
export class DebtorActionLogModule { }
