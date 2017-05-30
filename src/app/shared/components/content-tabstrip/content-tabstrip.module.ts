import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ContentTabService } from './tab/content-tab.service';

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
  ],
  providers: [
    ContentTabService
  ],
})
export class ContentTabstripModule { }
