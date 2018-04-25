import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CheckboxComponent } from './checkbox/checkbox.component';
import { RadioButtonComponent } from './radiobutton/radiobutton.component';
import { TickComponent } from './tick/tick.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [
    CheckboxComponent,
    RadioButtonComponent,
    TickComponent,
  ],
  declarations: [
    CheckboxComponent,
    RadioButtonComponent,
    TickComponent,
  ],
})
export class CheckModule {}
