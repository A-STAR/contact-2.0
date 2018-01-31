import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ViewFormComponent } from './view-form.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    ViewFormComponent,
  ],
  declarations: [
    ViewFormComponent,
  ],
})
export class ViewFormModule {}
