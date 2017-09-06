import { NgModule } from '@angular/core';

import { DebtorActionLogComponent } from './action-log.component';
import { GridModule } from '../../../components/grid/grid.module';

import { ActionLogService } from './action-log.service';

@NgModule({
  imports: [
    GridModule,
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
