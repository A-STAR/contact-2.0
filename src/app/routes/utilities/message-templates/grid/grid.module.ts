import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';
import { MessageTemplateGridEditModule } from '../card/card.module';

import { MessageTemplateGridComponent } from './grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    GridsModule,
    MessageTemplateGridEditModule,
  ],
  exports: [
    MessageTemplateGridComponent,
  ],
  declarations: [
    MessageTemplateGridComponent,
  ],
  entryComponents: [
    MessageTemplateGridComponent,
  ]
})
export class MessageTemplateGridModule {}
