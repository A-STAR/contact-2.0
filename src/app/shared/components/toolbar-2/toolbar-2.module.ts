import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { Toolbar2Component } from './toolbar-2.component';
import { Toolbar2ButtonComponent } from './button/toolbar-2-button.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    Toolbar2Component,
    Toolbar2ButtonComponent,
  ],
  declarations: [
    Toolbar2Component,
    Toolbar2ButtonComponent,
  ]
})
export class Toolbar2Module { }
