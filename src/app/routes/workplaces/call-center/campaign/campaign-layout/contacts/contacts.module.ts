import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { ContactsComponent } from './contacts.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    ContactsComponent,
  ],
  declarations: [
    ContactsComponent,
  ],
})
export class ContactsModule {}
