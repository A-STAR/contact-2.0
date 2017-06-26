import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { DataViewComponent } from './data-view.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    DataViewComponent,
  ],
  declarations: [
    DataViewComponent,
  ],
  providers: [],
})
export class DataViewModule { }
