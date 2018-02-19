import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { CheckboxComponent } from './checkbox.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  declarations: [
    CheckboxComponent,
  ],
  exports: [
    CheckboxComponent,
  ]
})
export class CheckboxModule {}
