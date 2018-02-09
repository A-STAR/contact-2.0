import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular/main';
import { LicenseManager } from 'ag-grid-enterprise/main';
import { TranslateModule } from '@ngx-translate/core';

import { GridTree2Component } from '@app/shared/components/gridtree2/gridtree2.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AgGridModule.withComponents([]),
  ],
  exports: [
    GridTree2Component,
  ],
  declarations: [
    GridTree2Component,
  ]
})
export class GridTree2Module {
  constructor() {
    // tslint:disable-next-line
    LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_For_Production_1Devs20_January_2018__MTUxNjQwNjQwMDAwMA==4091ca44a0ac9c86778d044f42c5edc1');
  }
}
