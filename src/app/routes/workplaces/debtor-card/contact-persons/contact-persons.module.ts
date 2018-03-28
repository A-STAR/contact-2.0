import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactPersonsCardModule } from './card/contact-persons-card.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContactPersonsComponent } from './contact-persons.component';

const routes: Routes = [
  {
    path: '',
    component: ContactPersonsComponent,
  }
];

@NgModule({
  imports: [
    ContactPersonsCardModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    ContactPersonsComponent,
  ],
})
export class ContactPersonsModule {}
