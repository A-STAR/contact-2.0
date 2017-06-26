import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { RestrictedViewComponent } from './restricted-view.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    RestrictedViewComponent,
  ],
  declarations: [
    RestrictedViewComponent,
  ],
  providers: [],
})
export class RestrictedViewModule { }
