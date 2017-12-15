import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageTemplatesService } from './message-templates.service';
import { SharedModule } from '../../../shared/shared.module';

import { MessageTemplateGridEditModule } from './card/card.module';
import { MessageTemplateGridModule } from './grid/grid.module';

import { MessageTemplatesComponent } from './message-templates.component';

const routes: Routes = [
  { path: '', component: MessageTemplatesComponent },
];

@NgModule({
  imports: [
    MessageTemplateGridEditModule,
    MessageTemplateGridModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    MessageTemplatesComponent,
  ],
  providers: [
    MessageTemplatesService,
  ],
})
export class MessageTemplatesModule {}
