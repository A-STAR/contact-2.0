import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { ResultDialogModule } from '../../../../../components/dialog/result/result-dialog.module';
import { EntityGroupDialogModule } from '../../../entity-group/dialog/entity-group-dialog.module';

import { EntityGroupAddComponent } from './entity-group-add.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    ResultDialogModule,
    EntityGroupDialogModule,
    TranslateModule,
  ],
  exports: [
    EntityGroupAddComponent,
  ],
  declarations: [
    EntityGroupAddComponent,
  ],
  entryComponents: [
    EntityGroupAddComponent,
  ]
})
export class EntityGroupAddModule { }
