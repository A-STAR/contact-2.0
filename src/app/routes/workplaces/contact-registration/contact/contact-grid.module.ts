import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { ContactCardComponent } from './card/contact-card.component';
import { ContactGridComponent } from './grid/contact-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContactCardComponent,
    ContactGridComponent,
  ],
  declarations: [
    ContactCardComponent,
    ContactGridComponent,
  ],
})
export class ContactModule {}
