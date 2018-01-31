import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionDialogModule } from '@app/shared/components/dialog/action/action-dialog.module';
import { GridModule } from '@app/shared/components/grid/grid.module';

import { OutsourcingService } from './outsourcing.service';

import { OutsourcingSendComponent } from './send/outsourcing-send.component';
import { OutsourcingExcludeComponent } from './exclude/outsourcing-exclude.component';
import { OutsourcingReturnComponent } from './return/outsourcing-return.component';

@NgModule({
  imports: [
    CommonModule,
    ActionDialogModule,
    GridModule,
  ],
  providers: [ OutsourcingService ],
  declarations: [ OutsourcingSendComponent, OutsourcingExcludeComponent, OutsourcingReturnComponent ],
  exports: [ OutsourcingSendComponent, OutsourcingExcludeComponent, OutsourcingReturnComponent ]
})
export class OutsourcingModule { }
