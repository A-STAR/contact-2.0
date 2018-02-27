import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';

import { SingleSelectComponent } from './single-select.component';

@NgModule({
  imports: [
    FormsModule,
    SelectModule,
    SharedModule,
  ],
  declarations: [
    SingleSelectComponent,
  ],
  exports: [
    SingleSelectComponent,
  ]
})
export class SingleSelectModule {}
