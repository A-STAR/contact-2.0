import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicLayoutModule } from '@app/shared/components/dynamic-layout/dynamic-layout.module';

import { CustomOperationParamsComponent } from './custom-operation-params.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicLayoutModule,
  ],
  declarations: [
    CustomOperationParamsComponent
  ],
  exports: [
    CustomOperationParamsComponent
  ],
})
export class CustomOperationParamsModule {}
