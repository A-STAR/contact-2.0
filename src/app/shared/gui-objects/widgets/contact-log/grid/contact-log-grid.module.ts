import { NgModule } from '@angular/core';

import { GridModule } from '../../../../components/grid/grid.module';

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
  ]
})
export class ContactLogGridModule { }
