import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';

import { IDynamicLayoutConfig } from '../dynamic-layout.interface';
import { IDynamicLayoutCustomOperation } from './custom-operation.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { DynamicLayoutComponent } from '../dynamic-layout.component';
import { ICustomOperationParams } from '@app/shared/mass-ops/custom-operation/custom-operation.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout-custom-operation',
  templateUrl: 'custom-operation.component.html'
})
export class CustomOperationComponent implements OnInit {

  @Input() operation: IDynamicLayoutCustomOperation;

  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  config: IDynamicLayoutConfig;

  constructor(
    private cdRef: ChangeDetectorRef,
    private customOperationService: CustomOperationService,
  ) {}

  get key(): string {
    return this.operation.uid + ':' + this.operation.id;
  }

  get label(): string {
    return this.operation.label || 'Start';
  }

  @HostBinding('style.flex')
  get flex(): string {
    return this.operation.size
      ? `${this.operation.size} 0`
      : `0 0 auto`;
  }

  ngOnInit(): void {
    this.customOperationService
      .fetchOperationParams(this.operation.id)
      .pipe(
        map(params => this.filterInputParams(params)),
        map(params => this.customOperationService.getActionInputParamsConfig(this.key, params))
      )
      .subscribe(config => {
        this.config = config;
        this.cdRef.markForCheck();
      });
  }

  onStart(): void {
    const data = this.layout.getData();
    this.customOperationService
      .schedule(this.operation.id, {} as any, data)
      .subscribe();
  }

  private filterInputParams(params: ICustomOperationParams[]): ICustomOperationParams[] {
    return params.filter(p => !this.operation.params.includes(p.systemName));
  }
}
