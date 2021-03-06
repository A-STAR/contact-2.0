import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { InputModule } from '@app/shared/components/form/input/input.module';
import { MenuSelectModule } from '@app/shared/components/menu/menu-select/menu-select.module';

import { MapFilterService } from '@app/shared/components/map/components/controls/filter/map-filter.service';

import { MapFilterComponent } from './map-filter.component';
import { MapFilterItemComponent } from './filter-item/map-filter-item.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    CheckModule,
    DropdownModule,
    InputModule,
    FormsModule,
    MenuSelectModule,
    TranslateModule,
  ],
  providers: [ MapFilterService ],
  declarations: [ MapFilterComponent, MapFilterItemComponent ],
  exports: [ MapFilterComponent ],
  entryComponents: [ MapFilterComponent ],
})
export class MapFilterModule { }
