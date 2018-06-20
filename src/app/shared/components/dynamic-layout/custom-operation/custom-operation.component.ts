import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';

import { ICustomOperationParams } from '@app/shared/mass-ops/custom-operation/custom-operation.interface';
import { IDynamicLayoutConfig } from '../dynamic-layout.interface';
import { IDynamicLayoutCustomOperation } from './custom-operation.interface';

import { ContextService } from '@app/core/context/context.service';
import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { DynamicLayoutComponent } from '../dynamic-layout.component';
import { mergeMap } from 'rxjs/operators/mergeMap';

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
    private contextService: ContextService,
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
    const formData = this.layout.getData();
    const streams = this.paramKeys.map(key => this.contextService.calculate(this.operation.params[key]));
    combineLatest(...streams)
      .pipe(
        mergeMap(params => {
          const p = this.paramKeys.reduce((acc, key, i) => ({ ...acc, [key]: params[i] }), {});
          const data = {
            ...formData,
            ...p,
          };
          return this.customOperationService.schedule(this.operation.id, {} as any, data);
        }),
      )
      .subscribe();
  }

  private filterInputParams(params: ICustomOperationParams[]): ICustomOperationParams[] {
    return params.filter(p => !this.paramKeys.includes(p.systemName));
  }

  private get paramKeys(): string[] {
    return Object.keys(this.operation.params);
  }
}
