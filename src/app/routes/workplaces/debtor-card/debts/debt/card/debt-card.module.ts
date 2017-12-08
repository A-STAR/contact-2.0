import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AccordionModule } from '../../../../../../shared/components/accordion/accordion.module';
import { DebtComponentModule } from '../../../../../../shared/gui-objects/widgets/debt/component/debt-component.module';
import { ComponentLogModule } from '../../../../../../shared/gui-objects/widgets/debt/component-log/component-log.module';
import { PortfolioLogModule } from '../../../../../../shared/gui-objects/widgets/debt/portfolio-log/portfolio-log.module';
import { DynamicFormModule } from '../../../../../../shared/components/form/dynamic-form/dynamic-form.module';
import { GridModule } from '../../../../../../shared/components/grid/grid.module';

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
    DebtComponentModule,
  ],
  declarations: [
    DebtCardComponent,
  ],
  entryComponents: [
    DebtCardComponent,
  ]
})
export class DebtCardModule { }
