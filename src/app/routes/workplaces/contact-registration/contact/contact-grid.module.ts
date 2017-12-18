import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../../shared/shared.module';

import { ContactGridService } from './contact-grid.service';

import { ContactCardComponent } from './card/contact-card.component';
import { ContactGridComponent } from './contact-grid.component';

@NgModule({
  imports: [
    SharedModule,
    TranslateModule,
  ],
  exports: [
    ContactCardComponent,
    ContactGridComponent,
  ],
  declarations: [
    ContactCardComponent,
    ContactGridComponent,
  ],
  providers: [
    ContactGridService,
  ]
})
export class ContactModule {}
