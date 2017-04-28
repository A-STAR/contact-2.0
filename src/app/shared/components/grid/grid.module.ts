import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { GridComponent } from './grid.component';
import { GridService } from './grid.service';

@NgModule({
  imports: [
    CommonModule,
    NgxDatatableModule,
  ],
  exports: [
    GridComponent
  ],
  declarations: [
    GridComponent,
  ],
  providers: [
    GridService
  ],
})
export class GridModule { }
