import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../../shared/shared.module';

import { ContactSelectService } from './contact-select.service';

import { ContactSelectComponent } from './contact-select.component';
import { ContactSelectCardComponent } from './card/contact-select-card.component';
import { ContactSelectGridComponent } from './grid/contact-select-grid.component';

@NgModule({
  imports: [
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
  ],
  providers: [
    ContactSelectService,
  ]
})
export class ContactSelectModule {}
