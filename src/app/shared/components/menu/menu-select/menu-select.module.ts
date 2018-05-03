import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { TranslateModule } from '@ngx-translate/core';

import { MenuSelectComponent } from './menu-select.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CheckModule,
    FormsModule,
    TranslateModule,
  ],
  declarations: [ MenuSelectComponent ],
  exports: [ MenuSelectComponent ]
})
export class MenuSelectModule { }
