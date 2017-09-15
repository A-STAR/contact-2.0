import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageTemplateGridModule } from './grid/message-template-grid.module';

@NgModule({
  imports: [
    MessageTemplateGridModule,
    CommonModule,
  ],
  exports: [
    MessageTemplateGridModule,
  ]
})
export class MessageTemplateModule { }
