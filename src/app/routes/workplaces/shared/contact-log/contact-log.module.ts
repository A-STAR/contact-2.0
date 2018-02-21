import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactLogService } from './contact-log.service';

import { ContactLogCardComponent } from './card/contact-log-card.component';
import { ContactLogGridComponent } from './grid/contact-log-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ContactLogCardComponent,
    ContactLogGridComponent,
  ],
  declarations: [
    ContactLogCardComponent,
    ContactLogGridComponent,
  ],
  providers: [
    ContactLogService,
  ]
})
export class ContactLogModule {}
