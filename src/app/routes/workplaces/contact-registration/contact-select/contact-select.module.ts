import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SelectModule } from '../../../../shared/components/form/select/select.module';
import { SharedModule } from '../../../../shared/shared.module';

import { ContactSelectService } from './contact-select.service';

import { ContactSelectComponent } from './contact-select.component';
import { ContactSelectCardComponent } from './card/contact-select-card.component';
import { ContactSelectGridComponent } from './grid/contact-select-grid.component';
import { ContactSelectSearchComponent } from './search/contact-select-search.component';

@NgModule({
  imports: [
    SelectModule,
    SharedModule,
    TranslateModule,
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
