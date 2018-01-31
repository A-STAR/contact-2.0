import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MomentPipe } from './moment.pipe';

@NgModule({
  imports: [
    TranslateModule,
  ],
  exports: [
    MomentPipe,
  ],
  declarations: [
    MomentPipe,
  ],
})
export class MomentModule {}
