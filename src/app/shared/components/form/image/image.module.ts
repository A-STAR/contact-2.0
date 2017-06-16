import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormImageComponent } from './image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [
    FormImageComponent,
  ],
  declarations: [
    FormImageComponent,
  ],
  providers: [],
})
export class FormImageModule { }
