import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { MessageTemplateGridComponent } from './message-template-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
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
