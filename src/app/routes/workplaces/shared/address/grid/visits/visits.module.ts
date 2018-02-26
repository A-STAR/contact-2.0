import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { VisitService } from './visits.service';

import { AddressGridVisitsComponent } from './visits.component';

@NgModule({
  imports: [
    CommonModule,
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
