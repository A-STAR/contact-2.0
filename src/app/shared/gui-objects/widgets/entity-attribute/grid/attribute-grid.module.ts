import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeGridEditModule } from '@app/shared/gui-objects/widgets/entity-attribute/grid/edit/attribute-grid-edit.module';
import { AttributeVersionModule } from '@app/shared/gui-objects/widgets/entity-attribute/grid/version/attribute-version.module';
import { GridTree2WrapperModule } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.module';
import { Toolbar2Module } from '@app/shared/components/toolbar-2/toolbar-2.module';

import { AttributeGridComponent } from '@app/shared/gui-objects/widgets/entity-attribute/grid/attribute-grid.component';
import {
  AttributeVersionComponent
} from '@app/shared/gui-objects/widgets/entity-attribute/grid/version/attribute-version.component';


@NgModule({
  imports: [
    AttributeGridEditModule,
    AttributeVersionModule,
    CommonModule,
    GridTree2WrapperModule,
    Toolbar2Module
  ],
  exports: [
    AttributeGridComponent,
    AttributeVersionComponent
  ],
  declarations: [
    AttributeGridComponent,
  ],
  entryComponents: [
    AttributeGridComponent,
  ]
})
export class AttributeGridModule { }
