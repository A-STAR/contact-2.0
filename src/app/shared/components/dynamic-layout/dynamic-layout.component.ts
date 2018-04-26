import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';

import { IDynamicLayoutConfig, IDynamicLayoutGroup } from './interface';

import { AttributeService } from './services/attribute.service';
import { FormService } from './services/form.service';
import { LayoutService } from './services/layout.service';
import { TemplateService } from './services/template.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    AttributeService,
    FormService,
    LayoutService,
    TemplateService,
  ],
  selector: 'app-dynamic-layout',
  templateUrl: 'dynamic-layout.component.html'
})
export class DynamicLayoutComponent implements OnInit {
  @Input() layout: string | IDynamicLayoutConfig;
  @Input() templates: Record<string, TemplateRef<any>>;

  constructor(
    private layoutService: LayoutService,
    private templateService: TemplateService,
  ) {}

  get initialized(): boolean {
    return this.layoutService.initialized;
  }

  get group(): IDynamicLayoutGroup {
    return this.layoutService.group;
  }

  ngOnInit(): void {
    this.layoutService.layout = this.layout;
    this.templateService.init(this.templates);
  }
}
