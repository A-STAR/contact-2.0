import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit, TemplateRef } from '@angular/core';

import { IDynamicLayoutTemplate } from '../dynamic-layout.interface';

import { TemplateService } from '../template/template.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout-template',
  templateUrl: 'template.component.html'
})
export class TemplateComponent implements OnInit {
  @Input() template: IDynamicLayoutTemplate;

  tRef: TemplateRef<any>;

  constructor(
    private templateService: TemplateService,
  ) {}

  @HostBinding('style.flex')
  get flex(): string {
    return this.template.size
      ? `${this.template.size} 0`
      : `0 0 auto`;
  }

  ngOnInit(): void {
    this.tRef = this.templateService.templates[this.template.value];
  }
}
