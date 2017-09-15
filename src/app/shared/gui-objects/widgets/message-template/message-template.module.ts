import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageTemplateGridModule } from './grid/message-template-grid.module';

import { MessageTemplateService } from './message-template.service';

@NgModule({
  imports: [
    MessageTemplateGridModule,
    CommonModule,
  ],
  exports: [
    MessageTemplateGridModule,
  ],
  providers: [
    MessageTemplateService,
  ]
})
export class MessageTemplateModule { }
