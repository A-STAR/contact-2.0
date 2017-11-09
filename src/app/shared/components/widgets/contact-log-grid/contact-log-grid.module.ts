import { NgModule } from '@angular/core';

import { GridModule } from '../../grid/grid.module';

import { ContactLogGridService } from './contact-log-grid.service';

import { ContactLogGridComponent } from './contact-log-grid.component';

@NgModule({
  imports: [
    GridModule,
  ],
  exports: [
    ContactLogGridComponent,
  ],
  declarations: [
    ContactLogGridComponent,
  ],
  providers: [
    ContactLogGridService,
  ]
})
export class ContactLogGridModule { }
