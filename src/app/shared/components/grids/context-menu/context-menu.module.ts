import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ContextMenuService } from '@app/shared/components/grids/context-menu/context-menu.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  declarations: [],
  providers: [
    ContextMenuService,
  ],
})
export class ContextMenuModule { }
