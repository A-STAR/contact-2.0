import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MomentModule } from '@app/shared/pipes/moment/moment.module';
import { ToolbarModule } from '@app/shared/components/toolbar/toolbar.module';

import { ContactLogDetailsService } from './contact-log-details.service';

import { ContactLogDetailsComponent } from './contact-log-details.component';

@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    TranslateModule,
    ToolbarModule,
  ],
  providers: [ ContactLogDetailsService ],
  declarations: [ ContactLogDetailsComponent ],
  exports: [ ContactLogDetailsComponent ]
})
export class ContactLogDetailsModule { }
