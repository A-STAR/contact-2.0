import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../../components/grid/grid.module';
import { TabViewModule } from '../../../../../../shared/components/layout/tabview/tabview.module';

import { PortfolioLogGridComponent } from './portfolio-log-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    TabViewModule,
  ],
  exports: [
    PortfolioLogGridComponent,
  ],
  declarations: [
    PortfolioLogGridComponent,
  ],
  entryComponents: [
    PortfolioLogGridComponent,
  ]
})
export class PortfolioLogGridModule { }
