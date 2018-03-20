import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { FormsComponent } from './forms.component';

const routes: Routes = [
  {
    path: '',
    component: FormsComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    FormsComponent,
  ],
  exports: [
    RouterModule,
  ]
})
export class FormsModule {}
