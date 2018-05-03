import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';

import { IDynamicLayoutConfig, IDynamicLayoutGroup } from './dynamic-layout.interface';

import { AttributeService } from './attribute/attribute.service';
import { ControlService } from './control/control.service';
import { DynamicLayoutService } from './dynamic-layout.service';
import { EventService } from './event/event.service';
import { TemplateService } from './template/template.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    AttributeService,
    ControlService,
    EventService,
    DynamicLayoutService,
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

  readonly ready$ = this.layoutService.ready$;

  constructor(
    private formService: ControlService,
    private layoutService: DynamicLayoutService,
    private templateService: TemplateService,
  ) {}

  get group(): IDynamicLayoutGroup {
    return this.layoutService.group;
  }

  ngOnInit(): void {
    this.layoutService.init(this.layout);
    this.templateService.init(this.templates);
  }
}
