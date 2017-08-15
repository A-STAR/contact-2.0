import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AccordionModule } from '../../../../../components/accordion/accordion.module';
import { DebtComponentModule } from '../../component/debt-component.module';
import { ComponentLogModule } from '../../component-log/component-log.module';
import { PortfolioLogModule } from '../../portfolio-log/portfolio-log.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';
import { GridModule } from '../../../../../components/grid/grid.module';

import { DebtCardComponent } from './debt-card.component';

@NgModule({
  imports: [
    AccordionModule,
    CommonModule,
    ComponentLogModule,
    PortfolioLogModule,
    DebtComponentModule,
    DynamicFormModule,
    GridModule,
    TranslateModule,
  ],
  exports: [
    DebtCardComponent,
  ],
  declarations: [
    DebtCardComponent,
  ],
  entryComponents: [
    DebtCardComponent,
  ]
})
export class DebtCardModule { }
