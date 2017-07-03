import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ContentTabstripComponent } from './content-tabstrip.component';
import { ContentTabComponent } from './tab/content-tab.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
  ],
  exports: [
    ContentTabComponent,
    ContentTabstripComponent,
  ],
  declarations: [
    ContentTabComponent,
    ContentTabstripComponent,
  ]
})
export class ContentTabstripModule { }
