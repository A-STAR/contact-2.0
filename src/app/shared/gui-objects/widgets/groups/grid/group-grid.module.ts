import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';

import { GroupGridComponent } from './group-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
  ],
  exports: [
    GroupGridComponent,
  ],
  declarations: [
    GroupGridComponent,
  ],
  entryComponents: [
    GroupGridComponent,
  ]
})
export class GroupGridModule { }
