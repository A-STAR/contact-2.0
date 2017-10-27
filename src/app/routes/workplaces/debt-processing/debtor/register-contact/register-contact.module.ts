import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../shared/components/dialog/dialog.module';
import { SharedModule } from '../../../../../shared/shared.module';

import { RegisterContactComponent } from './register-contact.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    SharedModule,
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
