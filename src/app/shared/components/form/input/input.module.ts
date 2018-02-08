import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TextareaComponent } from './textarea/textarea.component';
import { TextComponent } from './text/text.component';

@NgModule({
  imports: [
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
