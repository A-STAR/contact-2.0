import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SelectComponent } from './select.component';
import { HighlightPipe, RawDataFilterPipe } from './select-pipes';
import { OffClickDirective } from './off-click';
import { AlignmentDirective } from '../../../directives/alignment/alignment.directive';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [
    AlignmentDirective,
    SelectComponent,
    HighlightPipe,
    RawDataFilterPipe,
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
