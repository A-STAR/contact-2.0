import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';

import { SleekTabComponent } from './tab.component';
import { SleekTabstripComponent } from './tabstrip.component';

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    TranslateModule,
  ],
  exports: [
    SleekTabComponent,
    SleekTabstripComponent,
  ],
  declarations: [
    SleekTabComponent,
    SleekTabstripComponent,
  ]
})
export class SleekTabstripModule { }
