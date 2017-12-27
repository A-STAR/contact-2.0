import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { ConnectionErrorComponent } from './connection-error/connection-error.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    LoginComponent,
    ConnectionErrorComponent,
  ],
  exports: [
    LoginComponent,
    ConnectionErrorComponent,
  ]
})
export class PagesModule { }
