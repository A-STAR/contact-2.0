import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { TermsComponent } from './terms.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    TermsComponent,
  ],
  declarations: [
    TermsComponent,
  ],
  providers: [
  ]
})
export class TermsModule {
}
