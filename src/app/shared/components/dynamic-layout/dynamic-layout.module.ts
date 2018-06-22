import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';

import { reducer as dynamicLayoutReducer } from './dynamic-layout.reducer';
import { DynamicLayoutEffects } from '@app/shared/components/dynamic-layout/dynamic-layout.effects';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { DateTimeModule } from '@app/shared/components/form/datetime/datetime.module';
import { DialogMultiSelectModule } from '@app/shared/components/form/dialog-multi-select/dialog-multi-select.module';
import { DropdownInputModule } from '@app/shared/components/form/dropdown/dropdown-input.module';
import { InputModule } from '@app/shared/components/form/input/input.module';
import { MultiSelectModule } from '@app/shared/components/form/select/multi/multi-select.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { TabViewModule } from '@app/shared/components/layout/tabview/tabview.module';

import { MetadataService } from './metadata.service';
import { GroupService } from './group/group.service';

import { AttributeComponent } from './attribute/attribute.component';
import { ControlComponent } from './control/control.component';
import { CustomOperationComponent } from './custom-operation/custom-operation.component';
import { DynamicLayoutComponent } from './dynamic-layout.component';
import { GroupComponent } from './group/group.component';
import { TemplateComponent } from './template/template.component';

@NgModule({
  imports: [
    AngularSplitModule,
    ButtonModule,
    CheckModule,
    CommonModule,
    DateTimeModule,
    DialogMultiSelectModule,
    DropdownInputModule,
    EffectsModule.forFeature([DynamicLayoutEffects]),
    InputModule,
    MultiSelectModule,
    ReactiveFormsModule,
    SelectModule,
    StoreModule.forFeature('layout', dynamicLayoutReducer),
    TabViewModule,
    TranslateModule,
  ],
  exports: [
    DynamicLayoutComponent,
  ],
  declarations: [
    AttributeComponent,
    ControlComponent,
    CustomOperationComponent,
    DynamicLayoutComponent,
    GroupComponent,
    TemplateComponent,
  ],
  providers: [
    GroupService,
    MetadataService,
  ],
})
export class DynamicLayoutModule {}
