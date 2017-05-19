import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { TermsComponent } from './terms.component';
import { TermEditComponent } from './term-edit/term-edit.component';
import { TermRemoveComponent } from './term-remove/term-remove.component';

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
    TermRemoveComponent,
  ],
  providers: [
  ]
})
export class TermsModule {
}
