import {
  ChangeDetectionStrategy, Component, Input, ViewChild,
  OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { ICustomOperationParams } from '../custom-operation.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

@Component({
  selector: 'app-custom-operation-params',
  templateUrl: './custom-operation-params.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [ './custom-operation-params.component.scss' ],
})
export class CustomOperationParamsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  @Input() key: string;
  @Input() params: ICustomOperationParams[];
  @Input() value: any;

  config: IDynamicLayoutConfig;

  private canSubmit$ = new BehaviorSubject<boolean>(false);
  private canSubmitSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private customOperationService: CustomOperationService
  ) {}

  ngOnInit(): void {
    this.config = this.customOperationService.getActionInputParamsConfig(this.key, this.params);
  }

  ngAfterViewInit(): void {
    this.canSubmitSub = this.layout.canSubmit()
      .subscribe(canSubmit => {
        this.canSubmit$.next(canSubmit);
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.canSubmitSub.unsubscribe();
  }

  get canSubmit(): boolean {
    return this.canSubmit$.value;
  }
}
