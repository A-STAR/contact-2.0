import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';

import { TabComponent } from './tab.component';
import { TabstripComponent } from './tabstrip.component';

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    TranslateModule,
  ],
  exports: [
    TabComponent,
    TabstripComponent,
  ],
  declarations: [
    TabComponent,
    TabstripComponent,
  ]
})
export class TabstripModule { }
