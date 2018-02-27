import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ContactPropertyTreeEditModule } from './edit/contact-property-tree-edit.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContactPropertyTreeComponent } from './contact-property-tree.component';

const routes: Routes = [
  {
    path: '',
    component: ContactPropertyTreeComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    FormsModule,
    ContactPropertyTreeEditModule,
    SelectModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    ContactPropertyTreeComponent,
  ],
  declarations: [
    ContactPropertyTreeComponent,
  ],
})
export class ContactPropertyTreeModule { }
