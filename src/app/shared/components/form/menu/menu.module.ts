import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MenuComponent } from './menu.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [MenuComponent],
  exports: [MenuComponent]
})
export class MenuModule { }
