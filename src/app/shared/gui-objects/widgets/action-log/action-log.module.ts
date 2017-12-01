import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetadataGridModule } from '../../../components/metadata-grid/metadata-grid.module';
import { DynamicFormModule } from '../../../components/form/dynamic-form/dynamic-form.module';
import { DebtorActionLogComponent } from './action-log.component';

import { ActionLogService } from './action-log.service';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    MetadataGridModule,
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
