import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

import { EmploymentCardComponent } from './employment-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
  ],
  exports: [
    EmploymentCardComponent,
  ],
  declarations: [
    EmploymentCardComponent,
  ],
  entryComponents: [
    EmploymentCardComponent,
  ]
})
export class EmploymentCardModule { }
