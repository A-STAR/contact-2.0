import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, TemplateRef, OnInit } from '@angular/core';

import { ICustomActionData } from '../custom-operation.interface';
import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

@Component({
  selector: 'app-custom-operation-output',
  templateUrl: './custom-operation-output.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomOperationOutputComponent implements OnInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @ViewChild('grid', { read: TemplateRef }) grid: TemplateRef<any>;

  @Input() outputConfig: IDynamicLayoutConfig[];
  @Input() result: ICustomActionData;

  @Output() close = new EventEmitter<ICloseAction>();

  config: IDynamicLayoutConfig;

  templates: Record<string, TemplateRef<any>>;

  ngOnInit(): void {
    this.templates = {
      grid: this.grid,
    };
  }

  onClose(): void {
    this.close.emit();
  }
}
