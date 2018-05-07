import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DictPipe } from './dict.pipe';
import { LookupPipe } from './lookup.pipe';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [ DictPipe, LookupPipe],
  exports: [DictPipe, LookupPipe]
})
export class DictionaryModule { }
