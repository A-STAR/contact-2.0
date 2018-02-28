import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';
import { MessageTemplateGridEditModule } from '../card/card.module';
import { Toolbar2Module } from '@app/shared/components/toolbar-2/toolbar-2.module';

import { MessageTemplateGridComponent } from './grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    GridsModule,
    MessageTemplateGridEditModule,
    Toolbar2Module,
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
