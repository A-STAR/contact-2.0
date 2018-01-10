import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { TabHeaderComponent } from './header/header.component';
import { TabViewTabComponent } from './tab/tab.component';
import { TabViewComponent } from './tabview/tabview.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
  ],
  exports: [
    TabHeaderComponent,
    TabViewTabComponent,
    TabViewComponent,
  ],
  declarations: [
    TabHeaderComponent,
    TabViewTabComponent,
    TabViewComponent,
  ]
})
export class TabViewModule { }
