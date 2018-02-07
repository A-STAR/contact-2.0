import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CheckboxComponent } from './checkbox/checkbox.component';
import { RadioButtonComponent } from './radiobutton/radiobutton.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    CheckboxComponent,
    RadioButtonComponent,
  ],
  declarations: [
    CheckboxComponent,
    RadioButtonComponent,
  ],
})
export class CheckModule {}
