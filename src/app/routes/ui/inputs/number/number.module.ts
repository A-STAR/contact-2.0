import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { NumberComponent } from './number.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  declarations: [
    NumberComponent,
  ],
  exports: [
    NumberComponent,
  ]
})
export class NumberModule {}
