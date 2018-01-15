import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtOpenIncomingCallService } from './debt-open-incoming-call.service';

import { DebtOpenIncomingCallComponent } from './debt-open-incoming-call.component';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [DebtOpenIncomingCallService],
  declarations: [DebtOpenIncomingCallComponent],
  exports: [DebtOpenIncomingCallComponent]
})
export class DebtOpenIncomingCallModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DebtOpenIncomingCallModule,
      providers: [DebtOpenIncomingCallService]
    };
  }
}
