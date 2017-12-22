import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { GridModule } from '../../../../components/grid/grid.module';

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
  declarations: [DictionaryComponent, PortfolioComponent, TimezoneComponent]
})
export class AttributesModule { }
