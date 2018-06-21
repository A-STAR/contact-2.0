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
import { fromEvent } from 'rxjs/observable/fromEvent';
import { filter, map } from 'rxjs/operators';

import { ICustomOperationParams } from '../custom-operation.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { ConfigService } from '@app/core/config/config.service';
import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private customOperationService: CustomOperationService,
    private domSanitizer: DomSanitizer,
  ) {}

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

    fromEvent(window, 'message')
      .pipe(
        map((message: MessageEvent) => message.data),
        filter(message => message.type === 'init' && message.direction === 'request' && message.params.id === this.id),
      )
      .subscribe(() => {
        const m = {
          type: 'init',
          direction: 'response',
          params: {
            id: this.id,
          },
          payload: {
            params: this.params,
            value: this.value,
          }
        };
        this.frame.nativeElement.contentWindow.postMessage(m, '*');
      });
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
