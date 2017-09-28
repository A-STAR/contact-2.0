import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { ContactsComponent } from './contacts.component';

const routes: Routes = [
  { path: '', component: ContactsComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    ContactsComponent,
  ],
})
export class ContactsModule {}
