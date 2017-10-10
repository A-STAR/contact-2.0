import { NgModule } from '@angular/core';
import { TreeTableModule } from 'primeng/primeng';

import { SharedModule } from '../../../../shared/shared.module';

import { ParametersFormComponent } from './parameters-form.component';

@NgModule({
  imports: [
    SharedModule,
    TreeTableModule,
  ],
  exports: [
    ParametersFormComponent,
  ],
  declarations: [
    ParametersFormComponent,
  ],
})
export class ParametersFormModule {}
