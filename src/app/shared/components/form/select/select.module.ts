import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MultiSelectModule } from './multi/multi-select.module';
import { SingleSelectModule } from './single/single-select.module';

import { SelectComponent } from './select.component';
import { SelectWrapperComponent } from './select-wrapper.component';
import { SortOptionsPipe } from './select-pipes';
import { OffClickDirective } from './off-click';
import { AlignmentDirective } from '../../../directives/alignment/alignment.directive';
import { FocusDirective } from '../../../directives/focus/focus.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    SingleSelectModule,
    TranslateModule,
  ],
  declarations: [
    AlignmentDirective,
    FocusDirective,
    OffClickDirective,
    SelectComponent,
    SelectWrapperComponent,
  ],
  exports: [
    MultiSelectModule,
    OffClickDirective,
    SelectComponent,
    SelectWrapperComponent,
    SingleSelectModule,
  ],
  providers: [
    SortOptionsPipe,
  ]
})
export class SelectModule {
}
