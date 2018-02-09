import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AttributeGridEditModule } from '@app/shared/gui-objects/widgets/attribute/grid/edit/attribute-grid-edit.module';
import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { GridTree2WrapperModule } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { Toolbar2Module } from '@app/shared/components/toolbar-2/toolbar-2.module';

import { AttributeGridComponent } from '@app/shared/gui-objects/widgets/attribute/grid/attribute-grid.component';

@NgModule({
  imports: [
    AttributeGridEditModule,
    CommonModule,
    DialogActionModule,
    FormsModule,
    GridTree2WrapperModule,
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
