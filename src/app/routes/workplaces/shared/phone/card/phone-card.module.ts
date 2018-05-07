import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';

import { PhoneCardComponent } from './phone-card.component';

const routes: Routes = [
  {
    path: '',
    component: PhoneCardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    PhoneCardComponent,
  ],
})
export class PhoneCardModule {}
