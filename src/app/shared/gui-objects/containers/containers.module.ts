import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlatContainerModule } from './flat/flat-container.module';
import { TabsContainerModule } from './tabs/tabs-container.module';

@NgModule({
  imports: [
    CommonModule,
    FlatContainerModule,
    TabsContainerModule,
  ],
  exports: [
    FlatContainerModule,
    TabsContainerModule,
  ]
})
export class ContainersModule { }
