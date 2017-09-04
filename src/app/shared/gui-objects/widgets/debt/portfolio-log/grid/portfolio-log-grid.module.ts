import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../../components/grid/grid.module';
import { TabstripModule } from '../../../../../components/tabstrip/tabstrip.module';

import { PortfolioLogGridComponent } from './portfolio-log-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    TabstripModule,
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
