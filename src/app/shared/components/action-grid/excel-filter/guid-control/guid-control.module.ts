import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';

import { GuidControlComponent } from './guid-control.component';

@NgModule({
  declarations: [
    GuidControlComponent,
  ],
  exports: [
    GuidControlComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    SelectModule,
    TranslateModule,
  ],
})
export class GuidControlModule {}
