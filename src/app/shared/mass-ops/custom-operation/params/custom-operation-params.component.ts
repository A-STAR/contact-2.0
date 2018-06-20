import {
  ChangeDetectionStrategy, Component, Input, ViewChild,
  OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { ICustomOperationParams } from '../custom-operation.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { ConfigService } from '@app/core/config/config.service';
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

  @Input() id: number;
  @Input() key: string;
  @Input() params: ICustomOperationParams[];
  @Input() value: any;

  config: IDynamicLayoutConfig;

  private canSubmit$ = new BehaviorSubject<boolean>(false);
  private canSubmitSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private configService: ConfigService,
    private customOperationService: CustomOperationService,
    private domSanitizer: DomSanitizer,
  ) {}

  get thirdPartyUrl(): SafeUrl {
    const url = this.configService.getThirdPartyOperationUrl(this.id);
    return url
      ? this.domSanitizer.bypassSecurityTrustResourceUrl(url)
      : null;
  }

  ngOnInit(): void {
    if (!this.thirdPartyUrl) {
      this.config = this.customOperationService.getActionInputParamsConfig(this.key, this.params);
    }
  }

  ngAfterViewInit(): void {
    if (this.layout) {
      this.canSubmitSub = this.layout.canSubmit()
        .subscribe(canSubmit => {
          this.canSubmit$.next(canSubmit);
          this.cdRef.markForCheck();
        });
    }
  }

  ngOnDestroy(): void {
    if (this.canSubmitSub) {
      this.canSubmitSub.unsubscribe();
    }
  }

  get canSubmit(): boolean {
    return this.canSubmit$.value;
  }
}
