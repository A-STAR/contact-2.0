import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerModule } from './container/container.module';
import { WidgetsModule } from './widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    ContainerModule,
    WidgetsModule,
  ],
  exports: [
    ContainerModule,
    WidgetsModule,
  ]
})
export class GuiObjectsModule { }
