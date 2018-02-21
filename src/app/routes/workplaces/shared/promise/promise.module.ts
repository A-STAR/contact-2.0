import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromiseCardModule } from './card/promise-card.module';
import { PromiseGridModule } from './grid/promise-grid.module';

import { PromiseService } from './promise.service';

@NgModule({
  imports: [
    PromiseCardModule,
    PromiseGridModule,
    CommonModule,
  ],
  exports: [
    PromiseCardModule,
    PromiseGridModule,
  ],
  providers: [
    PromiseService,
  ]
})
export class PromiseModule {}
