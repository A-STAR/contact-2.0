import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { TextareaComponent } from './textarea.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  declarations: [
    TextareaComponent,
  ],
  exports: [
    TextareaComponent,
  ]
})
export class TextareaModule {}
