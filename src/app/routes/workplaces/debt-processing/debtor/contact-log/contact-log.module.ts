import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { ContactLogComponent } from './contact-log.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContactLogComponent
  ],
  declarations: [
    ContactLogComponent
  ],
})
export class ContactLogModule {}
