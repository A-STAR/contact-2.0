import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { ICustomOperationParams } from '../custom-operation.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { ConfigService } from '@app/core/config/config.service';
import { CustomOperationParamsService } from '@app/shared/mass-ops/custom-operation/params/custom-operation-params.service';
import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CustomOperationParamsService,
  ],
  selector: 'app-custom-operation-params',
  styleUrls: [ './custom-operation-params.component.scss' ],
  templateUrl: './custom-operation-params.component.html',
})
export class CustomOperationParamsComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() id: number;
  @Input() key: string;
  @Input() params: ICustomOperationParams[];
  @Input() value: any;

  @ViewChild('frame') frame: ElementRef;
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  config: IDynamicLayoutConfig;

  private canSubmit$ = new BehaviorSubject<boolean>(false);
  private canSubmitSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private configService: ConfigService,
    private customOperationParamsService: CustomOperationParamsService,
    private customOperationService: CustomOperationService,
    private domSanitizer: DomSanitizer,
  ) {}

  get canSubmit(): boolean {
    return this.canSubmit$.value;
  }

  get thirdPartyUrl(): SafeUrl {
    const url = this.configService.getThirdPartyOperationUrl(this.id);
    return url
      ? this.domSanitizer.bypassSecurityTrustResourceUrl(`${url}?id=${this.id}`)
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
    this.customOperationParamsService.init(this.id, this.params);
    this.customOperationParamsService.messages$.subscribe(message => {
      if (this.frame && this.frame.nativeElement.contentWindow) {
        this.frame.nativeElement.contentWindow.postMessage(message, '*');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.canSubmitSub) {
      this.canSubmitSub.unsubscribe();
    }
  }
}
