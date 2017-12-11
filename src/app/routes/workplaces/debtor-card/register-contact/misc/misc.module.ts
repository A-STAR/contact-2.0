import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../../shared/components/grid/grid.module';
import { SharedModule } from '../../../../../shared/shared.module';

import { MiscComponent } from './misc.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    SharedModule,
  ],
  exports: [
    MiscComponent,
  ],
  declarations: [
    MiscComponent,
  ]
})
export class MiscModule { }
