import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ViewFormComponent } from './view-form.component';
import { ViewFormGroupComponent } from './group/view-form-group.component';

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
    ViewFormGroupComponent,
  ],
})
export class ViewFormModule {}
