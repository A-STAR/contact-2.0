import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { EntityGroupDialogModule } from '../entity-group-dialog.module';

import { EntityGroupAddComponent } from './entity-group-add.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
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
