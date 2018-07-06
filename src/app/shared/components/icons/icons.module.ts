import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconsService } from '@app/shared/components/icons/icons.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [ IconsService ],
})
export class IconsModule { }
