import { NgModule } from '@angular/core';
import { ButtonModule } from '@app/shared/components/button/button.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';

import { CustomOperationComponent } from './custom-operation.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
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
})
export class CustomOperationModule { }
