import { NgModule } from '@angular/core';

import { EmailService } from './email.service';

import { EmailComponent } from './email.component';

@NgModule({
  exports: [
    EmailComponent,
  ],
  declarations: [
    EmailComponent,
  ],
  providers: [
    EmailService,
  ],
})
export class EmailModule {}
