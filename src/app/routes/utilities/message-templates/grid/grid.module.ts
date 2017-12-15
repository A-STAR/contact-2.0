import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '../../../../shared/components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../shared/components/grid/grid.module';
import { MessageTemplateGridEditModule } from '../card/card.module';
import { Toolbar2Module } from '../../../../shared/components/toolbar-2/toolbar-2.module';

import { MessageTemplateGridComponent } from './grid.component';

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
