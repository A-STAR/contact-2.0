import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { MiscService } from './misc.service';

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
  providers: [
    MiscService,
  ]
})
export class MiscModule {}
