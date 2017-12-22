import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '../../../../../core/core.module';
import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { DictionaryComponent } from './dictionary/dictionary.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TimezoneComponent } from './timezone/timezone.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule
  ],
  declarations: [DictionaryComponent, PortfolioComponent, TimezoneComponent]
})
export class AttributesModule { }
