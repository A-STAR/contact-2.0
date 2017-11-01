import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../../shared/shared.module';

import { CompanyComponent } from './company.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    CompanyComponent,
  ],
  declarations: [
    CompanyComponent,
  ]
})
export class CompanyModule { }
