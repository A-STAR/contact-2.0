import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { MessageTemplatesComponent } from './message-templates.component';

const routes: Routes = [
  { path: '', component: MessageTemplatesComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    MessageTemplatesComponent,
  ],
})
export class MessageTemplatesModule {}
