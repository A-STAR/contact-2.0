import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MenuSelectComponent } from './menu-select.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [ MenuSelectComponent ],
  exports: [ MenuSelectComponent ]
})
export class MenuSelectModule { }
