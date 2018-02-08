import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TextComponent } from './text/text.component';

@NgModule({
  imports: [
    FormsModule,
  ],
  exports: [
    TextComponent,
  ],
  declarations: [
    TextComponent,
  ],
})
export class InputModule {}
