import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';

import { GridControlComponent } from './guid-control.component';

@NgModule({
  declarations: [
    GridControlComponent,
  ],
  exports: [
    GridControlComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    SelectModule,
  ],
})
export class GuidControlModule {}
