import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { TabViewTabComponent } from './tab.component';
import { TabViewComponent } from './tabview.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    TabViewTabComponent,
    TabViewComponent,
  ],
  declarations: [
    TabViewTabComponent,
    TabViewComponent,
  ]
})
export class TabViewModule { }
