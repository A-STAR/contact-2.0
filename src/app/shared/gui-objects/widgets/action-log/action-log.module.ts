import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Grid2Module } from '../../../components/grid2/grid2.module';
import { DynamicFormModule } from '../../../components/form/dynamic-form/dynamic-form.module';
import { DebtorActionLogComponent } from './action-log.component';

import { ActionLogService } from './action-log.service';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    Grid2Module,
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
