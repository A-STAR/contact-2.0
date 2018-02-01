import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CapitalizePipe } from './capitalize.pipe';

@NgModule({
  imports: [
    TranslateModule,
  ],
  exports: [
    CapitalizePipe,
  ],
  declarations: [
    CapitalizePipe,
  ],
})
export class CapitalizeModule {}
