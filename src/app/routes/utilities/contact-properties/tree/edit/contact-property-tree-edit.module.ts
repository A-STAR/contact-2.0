import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { ContactPropertyTreeEditComponent } from './contact-property-tree-edit.component';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
  ],
  exports: [
    ContactPropertyTreeEditComponent,
  ],
  declarations: [
    ContactPropertyTreeEditComponent,
  ],
})
export class ContactPropertyTreeEditModule {}
