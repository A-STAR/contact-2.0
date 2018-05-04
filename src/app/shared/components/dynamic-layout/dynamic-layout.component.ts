import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
    private controlService: ControlService,
    private formService: ControlService,
    private layoutService: DynamicLayoutService,
    private templateService: TemplateService,
  ) {}

  get group(): IDynamicLayoutGroup {
    return this.layoutService.group;
  }

  canSubmit(form?: string): Observable<boolean> {
    return this.controlService.getStatus(form);
  }

  getData(form?: string): any {
    return this.formService.getData(form);
  }

  ngOnInit(): void {
    this.layoutService.init(this.layout);
    this.templateService.init(this.templates);
  }
}