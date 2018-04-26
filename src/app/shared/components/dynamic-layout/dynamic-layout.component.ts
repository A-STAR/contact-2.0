import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { IDynamicLayoutConfig, IDynamicLayoutGroup } from './interface';

import { AttributeService } from './services/attribute.service';
import { FormService } from './services/form.service';
import { LayoutService } from './services/layout.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    AttributeService,
    FormService,
    LayoutService,
  ],
  selector: 'app-dynamic-layout',
  templateUrl: 'dynamic-layout.component.html'
})
export class DynamicLayoutComponent implements OnInit {
  @Input() layout: string | IDynamicLayoutConfig;

  constructor(
    private layoutService: LayoutService,
  ) {}

  get initialized(): boolean {
    return this.layoutService.initialized;
  }

  get group(): IDynamicLayoutGroup {
    return this.layoutService.group;
  }

  ngOnInit(): void {
    this.layoutService.layout = this.layout;
  }
}
