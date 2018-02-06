import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { UIComponent } from './ui.component';

const routes: Routes = [
  {
    path: '',
    component: UIComponent,
  },
];

@NgModule({
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    UIComponent,
  ],
})
export class UIModule {}
