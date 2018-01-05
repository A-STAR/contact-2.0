import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from '../select/select.module';

import { MultiLanguageComponent } from './multi-language.component';
import { LanguageTabsComponent } from './language-tabs/language-tabs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  exports: [
    MultiLanguageComponent,
  ],
  declarations: [
    LanguageTabsComponent,
    MultiLanguageComponent,
  ],
})
export class MultiLanguageModule { }
