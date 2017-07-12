import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { PopupInputComponent } from './popup-input.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
  ],
  declarations: [
    PopupInputComponent,
  ],
  exports: [
    PopupInputComponent,
  ]
})
export class PopupInputModule {
}
