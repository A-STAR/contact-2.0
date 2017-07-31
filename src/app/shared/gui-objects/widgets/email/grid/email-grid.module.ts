import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';

import { EmailGridComponent } from './email-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
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
