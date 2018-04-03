import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { ButtonsComponent } from './buttons.component';

const routes: Routes = [
  {
    path: '',
    component: ButtonsComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    ButtonsComponent,
  ],
})
export class ButtonsModule {}
