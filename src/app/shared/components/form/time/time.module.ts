import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TextMaskModule } from 'angular2-text-mask';

import { TimeComponent } from './time.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    TextMaskModule,
  ],
  declarations: [
    TimeComponent,
  ],
  exports: [
    TimeComponent,
  ]
})
export class TimeModule {
}
