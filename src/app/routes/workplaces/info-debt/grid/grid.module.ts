import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../shared/shared.module';

import { GridComponent } from './grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    GridComponent,
  ],
  declarations: [
    GridComponent,
  ],
})
export class GridModule { }
