import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextEditorComponent } from './text-editor.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    TextEditorComponent,
  ],
  declarations: [
    TextEditorComponent,
  ],
})
export class TextEditorModule {}
