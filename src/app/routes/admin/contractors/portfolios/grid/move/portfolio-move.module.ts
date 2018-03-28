import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { PortfolioMoveComponent } from './portfolio-move.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PortfolioMoveComponent
  ],
  declarations: [
    PortfolioMoveComponent,
  ]
})
export class PortfolioMoveModule {
}
