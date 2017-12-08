import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockDialogModule } from '../../../../../../shared/components/dialog/block/block-dialog.module';
import { DebtGridDialogsModule } from './dialogs/debt-grid-dialogs.module';
import { DialogActionModule } from '../../../../../../shared/components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../../../shared/components/grid/grid.module';
import { Toolbar2Module } from '../../../../../../shared/components/toolbar-2/toolbar-2.module';

import { DebtGridComponent } from './debt-grid.component';

@NgModule({
  imports: [
    BlockDialogModule,
    CommonModule,
    DebtGridDialogsModule,
    DialogActionModule,
    GridModule,
    Toolbar2Module,
  ],
  exports: [
    DebtGridComponent,
  ],
  declarations: [
    DebtGridComponent,
  ],
  entryComponents: [
    DebtGridComponent,
  ]
})
export class DebtGridModule { }
