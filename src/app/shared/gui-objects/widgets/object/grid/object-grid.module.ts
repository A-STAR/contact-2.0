import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { ObjectGridEditModule } from './add/object-grid-add.module';
import { SelectModule } from '../../../../components/form/select/select.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { ObjectGridComponent } from './object-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    FormsModule,
    GridModule,
    ObjectGridEditModule,
    ReactiveFormsModule,
    SelectModule,
    Toolbar2Module,
  ],
  exports: [
    ObjectGridComponent,
  ],
  declarations: [
    ObjectGridComponent,
  ],
  entryComponents: [
    ObjectGridComponent,
  ]
})
export class ObjectGridModule { }
