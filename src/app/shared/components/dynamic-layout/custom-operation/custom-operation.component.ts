import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map, mergeMap } from 'rxjs/operators';

import { ICustomOperationParams } from '@app/shared/mass-ops/custom-operation/custom-operation.interface';
import { IDynamicLayoutConfig } from '../dynamic-layout.interface';
import { IDynamicLayoutCustomOperation } from './custom-operation.interface';

import { ContextService } from '@app/core/context/context.service';
import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { DynamicLayoutComponent } from '../dynamic-layout.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout-custom-operation',
  templateUrl: 'custom-operation.component.html'
})
export class CustomOperationComponent implements OnInit {

  @Input() operation: IDynamicLayoutCustomOperation;

  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  readonly data$ = new BehaviorSubject<any>({});

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

      if (this.valueKeys.length > 0) {
        combineLatest(this.valueKeys.map(key => this.contextService.calculate(this.operation.value[key])))
          .pipe(
            first(),
            map(value => this.valueKeys.reduce((acc, key, i) => ({ ...acc, [key]: value[i] }), {})),
          )
          .subscribe(data => this.data$.next({ default: data }));
      }
  }

  onStart(): void {
    const formData = this.layout.getData();
    const paramStreams = this.paramKeys.map(key => this.contextService.calculate(this.operation.params[key]));
    combineLatest(...paramStreams)
      .pipe(
        first(),
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
    return Object.keys(this.operation.params || {});
  }

  private get valueKeys(): string[] {
    return Object.keys(this.operation.value || {});
  }
}
