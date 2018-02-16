import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { WSService } from './ws.service';

import { WSComponent } from './ws.component';

const routes: Routes = [
  {
    path: '',
    component: WSComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    WSComponent,
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    WSService,
  ],
})
export class WSModule {}
