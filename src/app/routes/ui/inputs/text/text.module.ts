import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { TextComponent } from './text.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  declarations: [
    TextComponent,
  ],
  exports: [
    TextComponent,
  ]
})
export class TextModule {}
