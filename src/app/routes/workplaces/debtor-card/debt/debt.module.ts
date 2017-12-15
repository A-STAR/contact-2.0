import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AccordionModule } from '../../../../shared/components/accordion/accordion.module';
import { ComponentLogModule } from '../../../../shared/gui-objects/widgets/debt/component-log/component-log.module';
import { DebtComponentModule } from '../../../../shared/gui-objects/widgets/debt/component/debt-component.module';
import { DynamicFormModule } from '../../../../shared/components/form/dynamic-form/dynamic-form.module';
import { GridModule } from '../../../../shared/components/grid/grid.module';
import { PortfolioLogModule } from '../../../../shared/gui-objects/widgets/debt/portfolio-log/portfolio-log.module';
import { TabViewModule } from '../../../../shared/components/layout/tabview/tabview.module';

import { DebtComponent } from './debt.component';

@NgModule({
  imports: [
    AccordionModule,
    CommonModule,
    ComponentLogModule,
    PortfolioLogModule,
    DebtComponentModule,
    DynamicFormModule,
    GridModule,
    TabViewModule,
    TranslateModule,
  ],
  exports: [
    DebtComponent,
    DebtComponentModule,
  ],
  declarations: [
    DebtComponent,
  ],
})
export class DebtModule { }