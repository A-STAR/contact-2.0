import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AreaModule } from '@app/shared/components/layout/area/area.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { DateTimeModule } from '@app/shared/components/form/datetime/datetime.module';
import { DropdownInputModule } from '@app/shared/components/form/dropdown/dropdown-input.module';
import { InputModule } from '@app/shared/components/form/input/input.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { TabViewModule } from '@app/shared/components/layout/tabview/tabview.module';

import { ContextService } from './context.service';
import { MetadataService } from './metadata.service';

import { AttributeComponent } from './attribute/attribute.component';
import { ControlComponent } from './control/control.component';
import { DynamicLayoutComponent } from './dynamic-layout.component';
import { GroupComponent } from './group/group.component';
import { TemplateComponent } from './template/template.component';

@NgModule({
  imports: [
    AreaModule,
    CheckModule,
    CommonModule,
    DateTimeModule,
    DropdownInputModule,
    InputModule,
    ReactiveFormsModule,
    SelectModule,
    TabViewModule,
  ],
  exports: [
    DynamicLayoutComponent,
  ],
  declarations: [
    AttributeComponent,
    ControlComponent,
    DynamicLayoutComponent,
    GroupComponent,
    TemplateComponent,
  ],
  providers: [
    ContextService,
    MetadataService,
  ],
})
export class DynamicLayoutModule {}
