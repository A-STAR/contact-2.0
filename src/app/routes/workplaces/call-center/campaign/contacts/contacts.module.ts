import { NgModule } from '@angular/core';

import { ContactsComponent } from './contacts.component';

@NgModule({
  exports: [
    ContactsComponent,
  ],
  declarations: [
    ContactsComponent,
  ],
})
export class ContactsModule { }
