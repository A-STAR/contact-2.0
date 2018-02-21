import { NgModule } from '@angular/core';

import { ContactPersonsCardModule } from '@app/routes/workplaces/debtor-card/contact-persons/card/contact-persons-card.module';
import { ContactPersonsGridModule } from '@app/routes/workplaces/debtor-card/contact-persons/grid/contact-persons-grid.module';
import { SharedModule } from '../../../../shared/shared.module';

import { ContactPersonsService } from '@app/routes/workplaces/debtor-card/contact-persons/contact-persons.service';

import { ContactPersonsComponent } from './contact-persons.component';

@NgModule({
  imports: [
    ContactPersonsCardModule,
    ContactPersonsGridModule,
    SharedModule,
  ],
  providers: [ ContactPersonsService ],
  exports: [
    ContactPersonsGridModule,
    ContactPersonsComponent,
  ],
  declarations: [
    ContactPersonsComponent
  ],
})
export class ContactPersonsModule {}
