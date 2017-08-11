import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DebtComponentCardModule } from '../card/debt-component-card.module';
import { DialogActionModule } from '../../../../../components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../../components/toolbar-2/toolbar-2.module';

import { DebtComponentGridComponent } from './debt-component-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DebtComponentCardModule,
    DialogActionModule,
    GridModule,
    Toolbar2Module,
    TranslateModule,
  ],
  exports: [
    DebtComponentGridComponent,
  ],
  declarations: [
    DebtComponentGridComponent,
  ],
  entryComponents: [
    DebtComponentGridComponent,
  ]
})
export class DebtComponentGridModule { }
