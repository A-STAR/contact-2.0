import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { ConnectionErrorComponent } from './connection-error.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ConnectionErrorComponent,
      }
    ]),
    SharedModule,
  ],
  declarations: [
    ConnectionErrorComponent,
  ],
})
export class ConnectionErrorModule {}
