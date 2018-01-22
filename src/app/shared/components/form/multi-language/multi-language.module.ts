import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';

import { MultiLanguageComponent } from './multi-language.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    MultiLanguageComponent,
  ],
  declarations: [
    MultiLanguageComponent,
  ],
})
export class MultiLanguageModule { }
