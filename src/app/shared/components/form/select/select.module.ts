import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MultiSelectModule } from './multi/multi-select.module';
import { SingleSelectModule } from './single/single-select.module';

import { SortOptionsPipe } from './select.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    SingleSelectModule,
    TranslateModule,
  ],
  declarations: [
    SortOptionsPipe,
  ],
  exports: [
    MultiSelectModule,
    SingleSelectModule,
  ],
  providers: [
    SortOptionsPipe
  ]
})
export class SelectModule {}
