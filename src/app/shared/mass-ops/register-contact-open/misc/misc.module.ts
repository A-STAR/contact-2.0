import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';

import { MiscComponent } from './misc.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    TranslateModule,
  ],
  exports: [
    MiscComponent,
  ],
  declarations: [
    MiscComponent,
  ]
})
export class MiscModule { }
