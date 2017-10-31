import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';

import { PledgeGridComponent } from './pledge-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
  ],
  exports: [
    PledgeGridComponent,
  ],
  declarations: [
    PledgeGridComponent,
  ],
  entryComponents: [
    PledgeGridComponent,
  ]
})
export class PledgeGridModule { }
