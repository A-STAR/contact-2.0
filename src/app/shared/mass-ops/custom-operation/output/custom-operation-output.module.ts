import { NgModule } from '@angular/core';
import { ButtonModule } from '@app/shared/components/button/button.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicLayoutModule } from '@app/shared/components/dynamic-layout/dynamic-layout.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';

import { CustomOperationOutputComponent } from './custom-operation-output.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DynamicLayoutModule,
    DialogModule,
    GridsModule,
    TranslateModule,
  ],
  declarations: [
    CustomOperationOutputComponent
  ],
  exports: [
    CustomOperationOutputComponent
  ],
})
export class CustomOperationOutputModule { }
