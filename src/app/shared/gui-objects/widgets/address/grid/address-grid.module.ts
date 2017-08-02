import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockDialogModule } from '../../../../components/dialog/block/block-dialog.module';
import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { AddressGridComponent } from './address-grid.component';

@NgModule({
  imports: [
    BlockDialogModule,
    CommonModule,
    DialogActionModule,
    GridModule,
    Toolbar2Module,
  ],
  exports: [
    AddressGridComponent,
  ],
  declarations: [
    AddressGridComponent,
  ],
  entryComponents: [
    AddressGridComponent,
  ]
})
export class AddressGridModule { }
