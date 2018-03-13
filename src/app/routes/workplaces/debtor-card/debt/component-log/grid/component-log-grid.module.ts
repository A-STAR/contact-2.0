import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ComponentLogGridComponent } from './component-log-grid.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ComponentLogGridComponent,
  ],
  declarations: [
    ComponentLogGridComponent,
  ],
  entryComponents: [
    ComponentLogGridComponent,
  ]
})
export class ComponentLogGridModule { }
