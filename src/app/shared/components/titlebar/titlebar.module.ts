import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../button/button.module';
import { DropdownModule } from '../dropdown/dropdown.module';

import { TitlebarComponent } from './titlebar.component';
import { MenuModule } from '@app/shared/components/form/menu/menu.module';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DropdownModule,
    MenuModule,
    TranslateModule,
  ],
  exports: [
    TitlebarComponent,
  ],
  declarations: [
    TitlebarComponent,
  ]
})
export class TitlebarModule { }
