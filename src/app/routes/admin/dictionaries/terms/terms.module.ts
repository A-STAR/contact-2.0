import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/components/flowtree/common/shared';
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
