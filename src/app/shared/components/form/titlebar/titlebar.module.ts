import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../button/button.module';
import { DropdownModule } from '../../dropdown/dropdown.module';

import { FormToolbarComponent } from './titlebar.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DropdownModule,
    TranslateModule,
  ],
  exports: [
    FormToolbarComponent,
  ],
  declarations: [
    FormToolbarComponent,
  ]
})
export class FormToolbarModule { }
