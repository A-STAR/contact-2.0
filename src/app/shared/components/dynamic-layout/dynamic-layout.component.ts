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
  host: { class: 'flex vertical' },
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

  isFormDisabled(groupName?: string): boolean {
    return this.controlService.isFormDisabled(groupName);
  }

  enableFormGroup(groupName?: string): void {
    this.controlService.enableFormGroup(groupName);
  }

  disableFormGroup(groupName?: string): void {
    this.controlService.disableFormGroup(groupName);
  }

  toggleFormGroup(groupName?: string, enabled: boolean = true): void {
    if (enabled) {
      this.controlService.enableFormGroup(groupName);
    } else {
      this.controlService.disableFormGroup(groupName);
    }
  }

  isValid(form?: string): Observable<boolean> {
    return this.controlService.isValid(form);
  }

  canSubmit(form?: string): Observable<boolean> {
    return this.controlService.canSubmit(form);
  }

  canSubmitAll(mustBeNotEmpty: boolean = false): Observable<boolean> {
    return this.controlService.canSubmitAll(mustBeNotEmpty);
  }

  resetForm(form?: string): void {
    this.formService.reset(form);
  }

  resetAndEnableAll(): void {
    this.formService.resetAndEnableAll();
  }

  getData(form?: string): any {
    return this.formService.getData(form);
  }

  setData(data: Record<string, any>): void {
    this.formService.setData(data);
  }

  ngOnInit(): void {
    this.layoutService.init(this.layout);
    this.templateService.init(this.templates);
  }
}
