import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { MarkService } from './mark.service';

import { AddressGridMarkComponent } from './mark.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    AddressGridMarkComponent,
  ],
  declarations: [
    AddressGridMarkComponent,
  ],
  providers: [
    MarkService,
  ],
})
export class AddressGridMarkModule {}
