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
import { filter, map, shareReplay } from 'rxjs/operators';

import { ICustomOperationParams } from '../custom-operation.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';
import {
  FrameMessageDirection,
  FrameMessageType,
  IFrameRequestMessage,
  IFrameResponseMessage,
} from './custom-operation-params.interface';

import { ConfigService } from '@app/core/config/config.service';
import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';
import { LookupService } from '@app/core/lookup/lookup.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

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

  private messages$ = fromEvent(window, 'message')
    .pipe(
      map((message: MessageEvent) => message.data as IFrameRequestMessage),
      filter(message => message.direction === FrameMessageDirection.REQUEST && message.operationId === this.id),
      shareReplay(),
    );

  constructor(
    private cdRef: ChangeDetectorRef,
    private configService: ConfigService,
    private customOperationService: CustomOperationService,
    private domSanitizer: DomSanitizer,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
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

    this.messages$.subscribe(message => {
      switch (message.type) {
        case FrameMessageType.DICTIONARY:
          this.onDictionaryMessage(message.params);
          break;
        case FrameMessageType.INIT:
          this.onInitMessage();
          break;
        case FrameMessageType.LOOKUP:
          this.onLookupMessage(message.params);
          break;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.canSubmitSub) {
      this.canSubmitSub.unsubscribe();
    }
  }

  private onDictionaryMessage(params: any): void {
    this.userDictionariesService
      .getDictionary(params.code)
      .subscribe(payload => {
        const message: IFrameResponseMessage = {
          type: FrameMessageType.DICTIONARY,
          direction: FrameMessageDirection.RESPONSE,
          operationId: this.id,
          params,
          payload,
        };
        this.frame.nativeElement.contentWindow.postMessage(message, '*');
      });
  }

  private onInitMessage(): void {
    const message: IFrameResponseMessage = {
      type: FrameMessageType.INIT,
      direction: FrameMessageDirection.RESPONSE,
      operationId: this.id,
      params: null,
      payload: {
        params: this.params,
        value: this.value,
      },
    };
    this.frame.nativeElement.contentWindow.postMessage(message, '*');
  }

  private onLookupMessage(params: any): void {
    this.lookupService
      .lookup(params.code)
      .subscribe(payload => {
        const message: IFrameResponseMessage = {
          type: FrameMessageType.LOOKUP,
          direction: FrameMessageDirection.RESPONSE,
          operationId: this.id,
          params,
          payload,
        };
        this.frame.nativeElement.contentWindow.postMessage(message, '*');
      });
  }
}
