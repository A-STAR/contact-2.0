import { NgModule } from '@angular/core';

import { ContactPersonsService } from './contact-persons.service';

@NgModule({
  providers: [
    ContactPersonsService,
  ],
})
export class ContactPersonsModule {}
