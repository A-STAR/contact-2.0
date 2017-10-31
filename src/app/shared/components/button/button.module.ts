import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonService } from './button.service';

import { ButtonComponent } from './button.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    ButtonComponent,
  ],
  declarations: [
    ButtonComponent,
  ],
  providers: [
    ButtonService,
  ]
})
export class ButtonModule { }
