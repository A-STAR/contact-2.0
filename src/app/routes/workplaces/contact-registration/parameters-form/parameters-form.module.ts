import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { ParametersFormComponent } from './parameters-form.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ParametersFormComponent,
  ],
  declarations: [
    ParametersFormComponent,
  ],
})
export class ParametersFormModule {}
