import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeGridEditModule } from './edit/attribute-grid-edit.module';
import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridTreeWrapperModule } from '../../../../components/gridtree-wrapper/gridtree-wrapper.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { AttributeGridComponent } from './attribute-grid.component';

@NgModule({
  imports: [
    AttributeGridEditModule,
    CommonModule,
    DialogActionModule,
    GridTreeWrapperModule,
    Toolbar2Module,
  ],
  exports: [
    AttributeGridComponent,
  ],
  declarations: [
    AttributeGridComponent,
  ],
  entryComponents: [
    AttributeGridComponent,
  ]
})
export class AttributeGridModule { }
