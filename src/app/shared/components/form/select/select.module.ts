import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SelectComponent } from './select.component';
import { RawDataFilterPipe } from './select-pipes';
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
    RawDataFilterPipe,
    OffClickDirective
  ],
  exports: [
    SelectComponent,
    OffClickDirective
  ]
})
export class SelectModule {
}
