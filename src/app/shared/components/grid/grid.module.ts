import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ToolbarModule } from '../toolbar/toolbar.module';
import { GridComponent } from './grid.component';
import { GridService } from './grid.service';
import { GridColumnDecoratorService } from './grid.column.decorator.service';

@NgModule({
  imports: [
    CommonModule,
    NgxDatatableModule,
    ToolbarModule,
  ],
  exports: [
    GridComponent,
  ],
  declarations: [
    GridComponent,
  ],
  providers: [
    GridService,
    GridColumnDecoratorService,
  ],
})
export class GridModule { }
