import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

import { IdentityCardComponent } from './identity-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
  ],
  exports: [
    IdentityCardComponent,
  ],
  declarations: [
    IdentityCardComponent,
  ],
})
export class IdentityCardModule { }
