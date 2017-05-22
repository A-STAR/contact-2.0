import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SelectComponent } from './select.component';
import { HighlightPipe } from './select-pipes';
import { OffClickDirective } from './off-click';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [
    SelectComponent,
    HighlightPipe,
    OffClickDirective
  ],
  exports: [
    SelectComponent,
    HighlightPipe,
    OffClickDirective
  ]
})
export class SelectModule {
}
