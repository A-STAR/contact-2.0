import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LayoutService } from './services/layout.service';
import { ContextService } from './services/context.service';
import { MetadataService } from './services/metadata.service';

import { DynamicLayoutComponent } from './dynamic-layout.component';
import { GroupComponent } from './components/group/group.component';
import { ItemComponent } from './components/item/item.component';
import { TemplateComponent } from './components/template/template.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DynamicLayoutComponent,
  ],
  declarations: [
    DynamicLayoutComponent,
    GroupComponent,
    ItemComponent,
    TemplateComponent,
  ],
  providers: [
    ContextService,
    LayoutService,
    MetadataService,
  ],
})
export class DynamicLayoutModule {}
