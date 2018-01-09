import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HtmlTextareaComponent } from './html-textarea.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    HtmlTextareaComponent,
  ],
  declarations: [
    HtmlTextareaComponent,
  ],
})
export class HtmlTextareaModule { }
