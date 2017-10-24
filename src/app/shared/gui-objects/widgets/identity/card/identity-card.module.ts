import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { IdentityCardComponent } from './identity-card.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    IdentityCardComponent,
  ],
  declarations: [
    IdentityCardComponent,
  ],
  entryComponents: [
    IdentityCardComponent,
  ]
})
export class IdentityCardModule { }
