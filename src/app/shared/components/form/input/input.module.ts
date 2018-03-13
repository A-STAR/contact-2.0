import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { NumberComponent } from './number/number.component';
import { TextareaComponent } from './textarea/textarea.component';
import { TextComponent } from './text/text.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [
    NumberComponent,
    TextareaComponent,
    TextComponent,
  ],
  declarations: [
    NumberComponent,
    TextareaComponent,
    TextComponent,
  ],
})
export class InputModule {}
