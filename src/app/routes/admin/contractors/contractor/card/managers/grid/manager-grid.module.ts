import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ManagerGridComponent } from './manager-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ManagerGridComponent
  ],
  exports: [
    ManagerGridComponent
  ],
})
export class ManagerGridModule { }
