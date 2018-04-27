import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';

import { AttributesService } from './attributes.service';
import { GridsModule } from '@app/shared/components/grids/grids.module';

import { DictionaryComponent } from './dictionary/dictionary.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TimezoneComponent } from './timezone/timezone.component';
import { StageComponent } from './stage/stage.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    GridsModule,
    TranslateModule,
  ],
  providers: [AttributesService],
  declarations: [DictionaryComponent, PortfolioComponent, TimezoneComponent, StageComponent],
  exports: [DictionaryComponent, PortfolioComponent, TimezoneComponent, StageComponent]
})
export class AttributesModule { }
