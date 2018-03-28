import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { PortfolioSendComponent } from './portfolio-send.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PortfolioSendComponent
  ],
  declarations: [
    PortfolioSendComponent,
  ]
})
export class PortfolioSendModule {
}
