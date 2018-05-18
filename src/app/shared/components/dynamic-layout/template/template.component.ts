import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';

import { IDynamicLayoutTemplate } from '../dynamic-layout.interface';

import { TemplateService } from '../template/template.service';
import { DynamicLayoutService } from '../dynamic-layout.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout-template',
  templateUrl: 'template.component.html'
})
export class TemplateComponent implements OnInit {
  @Input() template: IDynamicLayoutTemplate;

  enabled: boolean;
  tRef: TemplateRef<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dynamicLayoutService: DynamicLayoutService,
    private templateService: TemplateService,
  ) {}

  get accessDenied(): boolean {
    return this.enabled === false;
  }

  @HostBinding('style.flex')
  get flex(): string {
    return this.template.size
      ? `${this.template.size} 0`
      : `0 0 auto`;
  }

  ngOnInit(): void {
    this.tRef = this.templateService.templates[this.template.value];
    const { uid } = this.template;
    if (uid) {
      this.dynamicLayoutService.items[uid].streams.enabled.subscribe(enabled => {
        this.enabled = enabled;
        this.cdRef.markForCheck();
      });
    }
  }
}
