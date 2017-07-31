import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { EmailGridComponent } from './email-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    Toolbar2Module,
  ],
  exports: [
    EmailGridComponent,
  ],
  declarations: [
    EmailGridComponent,
  ],
  entryComponents: [
    EmailGridComponent,
  ]
})
export class EmailGridModule { }
