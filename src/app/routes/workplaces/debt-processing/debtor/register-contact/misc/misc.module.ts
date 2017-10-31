import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../../../shared/components/grid/grid.module';

import { MiscComponent } from './misc.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
  ],
  exports: [
    MiscComponent,
  ],
  declarations: [
    MiscComponent
  ],
  entryComponents: [
    MiscComponent,
  ]
})
export class MiscModule { }
