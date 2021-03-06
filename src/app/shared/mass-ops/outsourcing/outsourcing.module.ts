import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';

import { OutsourcingService } from './outsourcing.service';

import { OutsourcingSendComponent } from './send/outsourcing-send.component';
import { OutsourcingExcludeComponent } from './exclude/outsourcing-exclude.component';
import { OutsourcingReturnComponent } from './return/outsourcing-return.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    DialogModule,
    GridsModule,
    TranslateModule,
  ],
  providers: [ OutsourcingService ],
  declarations: [ OutsourcingSendComponent, OutsourcingExcludeComponent, OutsourcingReturnComponent ],
  exports: [ OutsourcingSendComponent, OutsourcingExcludeComponent, OutsourcingReturnComponent ]
})
export class OutsourcingModule { }
