import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { MultiSelectModule } from './multi/multi-select.module';
import { SingleSelectModule } from './single/single-select.module';

import { SelectComponent } from './select.component';

const routes: Routes = [
  {
    path: '',
    component: SelectComponent,
  },
];

@NgModule({
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    MultiSelectModule,
    SingleSelectModule,
  ],
  declarations: [
    SelectComponent,
  ],
  exports: [
    RouterModule,
  ]
})
export class SelectModule {}
