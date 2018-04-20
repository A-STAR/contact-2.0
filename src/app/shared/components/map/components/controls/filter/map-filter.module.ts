import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { MenuSelectModule } from '@app/shared/components/menu/menu-select/menu-select.module';

import { MapFilterService } from '@app/shared/components/map/components/controls/filter/map-filter.service';

import { MapFilterComponent } from './map-filter.component';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    CheckModule,
    DropdownModule,
    FormsModule,
    MenuSelectModule,
    TranslateModule,
  ],
  providers: [ MapFilterService ],
  declarations: [ MapFilterComponent ],
  exports: [ MapFilterComponent ],
  entryComponents: [ MapFilterComponent ],
})
export class MapFilterModule { }
