import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { MarkService } from './mark.service';

import { AddressGridMarkComponent } from './mark.component';

@NgModule({
  imports: [
    CommonModule,
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
