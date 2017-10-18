import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { MiscComponent } from './misc.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    MiscComponent,
  ],
  declarations: [
    MiscComponent,
  ],
})
export class MiscModule {}
