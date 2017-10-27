import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../shared/components/dialog/dialog.module';

import { RegisterContactComponent } from './register-contact.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
  ],
  exports: [
    RegisterContactComponent,
  ],
  declarations: [
    RegisterContactComponent,
  ]
})
export class RegisterContactModule { }
