import { NgModule } from '@angular/core';
import { ButtonModule } from '@app/shared/components/button/button.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CustomOperationInputModule } from './input/custom-operation-input.module';
import { CustomOperationOutputModule } from './output/custom-operation-output.module';
import { CustomOperationParamsModule } from './params/custom-operation-params.module';
import { DynamicLayoutModule } from '@app/shared/components/dynamic-layout/dynamic-layout.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';

import { CustomOperationService } from './custom-operation.service';

import { CustomOperationComponent } from './custom-operation.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    CustomOperationInputModule,
    CustomOperationOutputModule,
    CustomOperationParamsModule,
    DynamicLayoutModule,
    DialogModule,
    GridsModule,
    TranslateModule,
  ],
  declarations: [
    CustomOperationComponent
  ],
  exports: [
    CustomOperationComponent
  ],
  providers: [
    CustomOperationService
  ]
})
export class CustomOperationModule { }
