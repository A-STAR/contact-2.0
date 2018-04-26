import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ContextService } from './services/context.service';
import { MetadataService } from './services/metadata.service';

import { AttributeComponent } from './components/attribute/attribute.component';
import { ControlComponent } from './components/control/control.component';
import { DynamicLayoutComponent } from './dynamic-layout.component';
import { GroupComponent } from './components/group/group.component';
import { TemplateComponent } from './components/template/template.component';

@NgModule({
  imports: [
    CommonModule,
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
