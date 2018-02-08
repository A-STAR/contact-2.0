import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { TextareaComponent } from './textarea/textarea.component';
import { TextComponent } from './text/text.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    TextareaComponent,
    TextComponent,
  ],
  declarations: [
    TextareaComponent,
    TextComponent,
  ],
})
export class InputModule {}
