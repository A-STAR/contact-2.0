import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';

import { IDynamicLayoutTemplate } from '../dynamic-layout.interface';

import { TemplateService } from '../template/template.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-dynamic-layout-template',
  templateUrl: 'template.component.html'
})
export class TemplateComponent implements OnInit {
  @Input() template: IDynamicLayoutTemplate;

  tRef: TemplateRef<any>;

  constructor(
    private templateService: TemplateService,
  ) {}

  ngOnInit(): void {
    this.tRef = this.templateService.templates[this.template.value];
  }
}
