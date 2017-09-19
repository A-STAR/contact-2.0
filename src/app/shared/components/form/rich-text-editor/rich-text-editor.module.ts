import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RichTextEditorComponent } from './rich-text-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    RichTextEditorComponent,
  ],
  declarations: [
    RichTextEditorComponent,
  ],
})
export class RichTextEditorModule { }
