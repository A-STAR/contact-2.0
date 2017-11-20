import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { ContactLogComponent } from './contact-log.component';

const routes: Routes = [
  { path: '', component: ContactLogComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    ContactLogComponent,
  ]
})
export class ContactLogModule {}
