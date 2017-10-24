import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DropdownModule } from '../dropdown/dropdown.module';

import { Toolbar2Component } from './toolbar-2.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    TranslateModule,
  ],
  exports: [
    Toolbar2Component,
  ],
  declarations: [
    Toolbar2Component,
  ]
})
export class Toolbar2Module { }
