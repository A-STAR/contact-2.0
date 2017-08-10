import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { DebtCardComponent } from './debt-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    GridModule,
    Toolbar2Module,
    TranslateModule,
  ],
  exports: [
    DebtCardComponent,
  ],
  declarations: [
    DebtCardComponent,
  ],
  entryComponents: [
    DebtCardComponent,
  ]
})
export class DebtCardModule { }
