import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridModule } from '@app/shared/components/grid/grid.module';

import { AttributesService } from './attributes.service';

import { DictionaryComponent } from './dictionary/dictionary.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TimezoneComponent } from './timezone/timezone.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    GridModule,
    TranslateModule
  ],
  providers: [AttributesService],
  declarations: [DictionaryComponent, PortfolioComponent, TimezoneComponent],
  exports: [DictionaryComponent, PortfolioComponent, TimezoneComponent]
})
export class AttributesModule { }
