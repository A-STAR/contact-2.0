import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../../components/grid/grid.module';
import { TabstripModule } from '../../../../../components/tabstrip/tabstrip.module';

import { ComponentLogGridComponent } from './component-log-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    TabstripModule,
  ],
  exports: [
    ComponentLogGridComponent,
  ],
  declarations: [
    ComponentLogGridComponent,
  ],
  entryComponents: [
    ComponentLogGridComponent,
  ]
})
export class ComponentLogGridModule { }
