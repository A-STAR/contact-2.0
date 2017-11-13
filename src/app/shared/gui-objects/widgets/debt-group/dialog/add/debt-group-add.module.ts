import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { ResultDialogModule } from '../../../../../components/dialog/result/result-dialog.module';
import { EntityGroupModule } from '../../../entity-group/entity-group.module';

import { DebtGroupAddComponent } from './debt-group-add.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    ResultDialogModule,
    EntityGroupModule,
    TranslateModule,
  ],
  exports: [
    DebtGroupAddComponent,
  ],
  declarations: [
    DebtGroupAddComponent,
  ],
  entryComponents: [
    DebtGroupAddComponent,
  ]
})
export class DebtGroupAddModule { }
