import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { TermsComponent } from './terms.component';
import { TermEditComponent } from './edit/term-edit.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    TermsComponent,
  ],
  declarations: [
    TermsComponent,
    TermEditComponent,
  ],
  providers: [
  ]
})
export class TermsModule {
}
