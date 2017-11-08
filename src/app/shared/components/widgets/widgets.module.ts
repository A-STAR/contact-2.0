import { NgModule } from '@angular/core';

import { ContactLogGridModule } from './contact-log-grid/contact-log-grid.module';

@NgModule({
  imports: [
    ContactLogGridModule,
  ],
  exports: [
    ContactLogGridModule,
  ]
})
export class WidgetsModule { }
