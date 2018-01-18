import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationComponent } from './overview.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContactRegistrationComponent,
  ],
  declarations: [
    ContactRegistrationComponent,
  ],
})
export class OverviewModule {}
