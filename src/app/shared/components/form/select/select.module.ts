import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MultiSelectModule } from './multi/multi-select.module';

import { SelectComponent } from './select.component';
import { SortOptionsPipe } from './select.pipe';
import { AlignmentDirective } from '@app/shared/directives/alignment/alignment.directive';
import { FocusDirective } from '@app/shared/directives/focus/focus.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    TranslateModule,
  ],
  declarations: [
    AlignmentDirective,
    FocusDirective,
    SelectComponent,
    SortOptionsPipe,
  ],
  exports: [
    MultiSelectModule,
    SelectComponent,
  ],
  providers: [
    SortOptionsPipe
  ]
})
export class SelectModule {}
