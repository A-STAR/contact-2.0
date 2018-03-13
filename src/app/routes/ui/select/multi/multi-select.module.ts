import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { SingleSelectComponent } from './multi-select.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  declarations: [
    SingleSelectComponent,
  ],
  exports: [
    SingleSelectComponent,
  ]
})
export class MultiSelectModule {}
