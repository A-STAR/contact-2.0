import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MomentModule } from '@app/shared/pipes/moment/moment.module';
import { TitlebarModule } from '@app/shared/components/titlebar/titlebar.module';

import { ContactLogDetailsService } from './contact-log-details.service';

import { ContactLogDetailsComponent } from './contact-log-details.component';

@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    TranslateModule,
    TitlebarModule,
  ],
  providers: [ ContactLogDetailsService ],
  declarations: [ ContactLogDetailsComponent ],
  exports: [ ContactLogDetailsComponent ]
})
export class ContactLogDetailsModule { }
