import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';
import { MessageTemplateGridEditModule } from './edit/message-template-grid-edit.module';

import { MessageTemplateGridComponent } from './message-template-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    GridModule,
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
export class MessageTemplateGridModule { }
