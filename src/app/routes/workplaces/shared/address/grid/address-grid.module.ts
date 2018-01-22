import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressGridMarkModule } from './mark/mark.module';
import { AddressGridVisitsModule } from './visits/visits.module';
import { BlockDialogModule } from '@app/shared/components/dialog/block/block-dialog.module';
import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { GridModule } from '@app/shared/components/grid/grid.module';
import { Toolbar2Module } from '@app/shared/components/toolbar-2/toolbar-2.module';

import { AddressGridComponent } from './address-grid.component';

@NgModule({
  imports: [
    AddressGridMarkModule,
    AddressGridVisitsModule,
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
