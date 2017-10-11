import { NgModule } from '@angular/core';
import { TreeTableModule } from 'primeng/primeng';

import { SelectModule } from '../../../../shared/components/form/select/select.module';
import { SharedModule } from '../../../../shared/shared.module';

import { ParametersFormComponent } from './parameters-form.component';

@NgModule({
  imports: [
    SelectModule,
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
