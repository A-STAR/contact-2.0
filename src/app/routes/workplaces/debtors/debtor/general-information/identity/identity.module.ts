import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';

import { IdentityService } from './identity.service';

import { IdentityGridComponent } from './identity.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    IdentityGridComponent
  ],
  declarations: [
    IdentityGridComponent
  ],
  providers: [
    IdentityService
  ],
})
export class IdentityModule { }
