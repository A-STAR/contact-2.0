import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { ContactPropertiesComponent } from './contact-properties.component';

const routes: Routes = [
  { path: '', component: ContactPropertiesComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    ContactPropertiesComponent,
  ],
})
export class ContactPropertiesModule {}
