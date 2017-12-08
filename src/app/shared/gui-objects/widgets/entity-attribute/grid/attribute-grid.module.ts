import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributeGridEditModule } from './edit/attribute-grid-edit.module';
import { GridTreeWrapperModule } from '../../../../components/gridtree-wrapper/gridtree-wrapper.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';
import { AttributeVersionModule } from './version/attribute-version.module';

import { AttributeGridComponent } from './attribute-grid.component';
import { AttributeVersionComponent } from './version/attribute-version.component';

import { Routes, RouterModule } from '@angular/router';

@NgModule({
  imports: [
    AttributeGridEditModule,
    AttributeVersionModule,
    CommonModule,
    GridTreeWrapperModule,
    Toolbar2Module
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
