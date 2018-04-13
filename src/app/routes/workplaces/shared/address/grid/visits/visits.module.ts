import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { VisitService } from './visits.service';

import { AddressGridVisitsComponent } from './visits.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    AddressGridVisitsComponent,
  ],
  declarations: [
    AddressGridVisitsComponent,
  ],
  providers: [
    VisitService,
  ],
})
export class AddressGridVisitsModule {}
