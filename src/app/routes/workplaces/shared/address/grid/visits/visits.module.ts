import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridModule } from '@app/shared/components/grid/grid.module';

import { VisitService } from './visits.service';

import { AddressGridVisitsComponent } from './visits.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    GridModule,
    TranslateModule,
  ],
  exports: [
    AddressGridVisitsComponent,
  ],
  declarations: [
    AddressGridVisitsComponent,
  ],
  providers: [
    VisitService,
  ],
  entryComponents: [
    AddressGridVisitsComponent,
  ]
})
export class AddressGridVisitsModule { }
