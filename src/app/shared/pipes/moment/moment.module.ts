import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MomentFormatPipe } from './format.pipe';
import { MomentMonthPipe } from './month.pipe';
import { MomentWeekPipe } from './week.pipe';

@NgModule({
  imports: [
    TranslateModule,
  ],
  exports: [
    MomentFormatPipe,
    MomentMonthPipe,
    MomentWeekPipe,
  ],
  declarations: [
    MomentFormatPipe,
    MomentMonthPipe,
    MomentWeekPipe,
  ],
})
export class MomentModule {}
