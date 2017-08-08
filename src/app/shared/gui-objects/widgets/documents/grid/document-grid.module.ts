import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { DocumentGridComponent } from './document-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    GridModule,
    Toolbar2Module,
  ],
  exports: [
    DocumentGridComponent,
  ],
  declarations: [
    DocumentGridComponent,
  ],
  entryComponents: [
    DocumentGridComponent,
  ]
})
export class DocumentGridModule { }
