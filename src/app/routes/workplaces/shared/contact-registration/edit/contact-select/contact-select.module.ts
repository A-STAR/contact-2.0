import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactSelectService } from './contact-select.service';

import { ContactSelectComponent } from './contact-select.component';
import { ContactSelectCardComponent } from './card/contact-select-card.component';
import { ContactSelectGridComponent } from './grid/contact-select-grid.component';
import { ContactSelectSearchComponent } from './search/contact-select-search.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContactSelectComponent,
  ],
  declarations: [
    ContactSelectComponent,
    ContactSelectCardComponent,
    ContactSelectGridComponent,
    ContactSelectSearchComponent,
  ],
  providers: [
    ContactSelectService,
  ]
})
export class ContactSelectModule {}
