import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';

import { IDynamicLayoutConfig, IDynamicLayoutGroup } from './dynamic-layout.interface';

import { AttributeService } from './attribute/attribute.service';
import { FormService } from './control/form.service';
import { LayoutService } from './dynamic-layout.service';
import { TemplateService } from './template/template.service';

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

  @Input() set data(data: Record<string, any>) {
    this.formService.setData(data);
  }

  constructor(
    private formService: FormService,
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
    this.layoutService.init(this.layout);
    this.templateService.init(this.templates);
  }
}
