import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { GridComponent } from './grid.component';
import { GridService } from './grid.service';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { ContextSubmenuComponent } from './context-menu/context-submenu/context-submenu.component';

@NgModule({
  imports: [
    CommonModule,
    NgxDatatableModule,
    TranslateModule,
  ],
  exports: [
    GridComponent
  ],
  declarations: [
    ContextMenuComponent,
    GridComponent,
    ContextSubmenuComponent
  ],
  providers: [
    GridService,
  ],
})
export class GridModule { }
