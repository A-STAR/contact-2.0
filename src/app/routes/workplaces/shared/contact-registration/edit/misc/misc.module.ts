import { NgModule } from '@angular/core';

import { SelectModule } from '@app/shared/components/form/select/select.module';
import { SharedModule } from '@app/shared/shared.module';

import { MiscService } from './misc.service';

import { MiscComponent } from './misc.component';

@NgModule({
  imports: [
    SelectModule,
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
