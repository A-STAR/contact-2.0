import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AttributeGridEditModule } from './edit/attribute-grid-edit.module';
import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridTreeWrapperModule } from '../../../../components/gridtree-wrapper/gridtree-wrapper.module';
import { SelectModule } from '../../../../components/form/select/select.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { AttributeGridComponent } from './attribute-grid.component';

@NgModule({
  imports: [
    AttributeGridEditModule,
    CommonModule,
    DialogActionModule,
    FormsModule,
    GridTreeWrapperModule,
    SelectModule,
    Toolbar2Module,
    TranslateModule,
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
