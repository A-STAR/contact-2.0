import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonComponent } from './button.component';
import { ButtonService } from '@app/shared/components/button/button.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    ButtonComponent,
  ],
  providers: [ ButtonService ],
  declarations: [
    ButtonComponent,
  ],
})
export class ButtonModule { }
