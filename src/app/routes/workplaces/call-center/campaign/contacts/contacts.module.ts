import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { ContactsComponent } from './contacts.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContactsComponent,
  ],
  declarations: [
    ContactsComponent,
  ],
})
export class ContactsModule { }
