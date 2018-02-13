import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { RadioButtonComponent } from './radiobutton.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  declarations: [
    RadioButtonComponent,
  ],
  exports: [
    RadioButtonComponent,
  ]
})
export class RadioButtonModule {}
