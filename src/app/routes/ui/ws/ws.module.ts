import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { WSComponent } from './ws.component';

const routes: Routes = [
  {
    path: '',
    component: WSComponent,
  },
];

@NgModule({
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    WSComponent,
  ],
  exports: [
    RouterModule,
  ]
})
export class WSModule {}
