import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SingleSelectModule } from './single/single-select.module';
import { MultiSelectModule } from './multi/multi-select.module';

import { SelectComponent } from './select.component';
import { SelectWrapperComponent } from './select-wrapper.component';
import { RawDataFilterPipe } from './select-pipes';
import { OffClickDirective } from './off-click';
import { AlignmentDirective } from '../../../directives/alignment/alignment.directive';
import { FocusDirective } from '../../../directives/focus/focus.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SingleSelectModule,
    MultiSelectModule,
    TranslateModule
  ],
  declarations: [
    AlignmentDirective,
    SelectComponent,
    SelectWrapperComponent,
    RawDataFilterPipe,
    OffClickDirective,
    FocusDirective,
  ],
  exports: [
    SingleSelectModule,
    MultiSelectModule,
    SelectComponent,
    SelectWrapperComponent,
    OffClickDirective
  ]
})
export class SelectModule {
}
