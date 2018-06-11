import { NgModule } from '@angular/core';
import { ButtonModule } from '@app/shared/components/button/button.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CustomOperationParamsModule } from '../params/custom-operation-params.module';
import { DynamicLayoutModule } from '@app/shared/components/dynamic-layout/dynamic-layout.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';

import { CustomOperationInputComponent } from './custom-operation-input.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    CustomOperationParamsModule,
    DynamicLayoutModule,
    DialogModule,
    GridsModule,
    TranslateModule,
  ],
  declarations: [
    CustomOperationInputComponent
  ],
  exports: [
    CustomOperationInputComponent
  ],
})
export class CustomOperationInputModule { }
