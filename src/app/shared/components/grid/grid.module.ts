import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ToolbarModule } from '../toolbar/toolbar.module';
import { GridComponent } from './grid.component';
import { GridService } from './grid.service';
import { ContextMenuComponent } from './context-menu/context-menu.component';

@NgModule({
  imports: [
    CommonModule,
    NgxDatatableModule,
    TranslateModule,
    ToolbarModule,
  ],
  exports: [
    GridComponent
  ],
  declarations: [
    ContextMenuComponent,
    GridComponent
  ],
  providers: [
    GridService,
  ],
})
export class GridModule { }
