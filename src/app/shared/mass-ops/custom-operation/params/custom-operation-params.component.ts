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
import { of } from 'rxjs/observable/of';

import { FrameMessageType } from '@app/shared/mass-ops/custom-operation/params/custom-operation-params.interface';
import { ICustomOperationParams } from '../custom-operation.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { ConfigService } from '@app/core/config/config.service';
import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';
import { FrameService } from '@app/core/frame/frame.service';
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

  constructor(
    private cdRef: ChangeDetectorRef,
    private configService: ConfigService,
    private customOperationService: CustomOperationService,
    private domSanitizer: DomSanitizer,
    private frameService: FrameService,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  get canSubmit(): boolean {
    return this.canSubmit$.value;
  }

  get target(): () => Window {
    return () => this.frame ? this.frame.nativeElement.contentWindow : null;
  }

  get thirdPartyUrl(): SafeUrl {
    const url = this.configService.getThirdPartyOperationUrl(this.id);
    return url
      ? this.domSanitizer.bypassSecurityTrustResourceUrl(`${url}?id=${this.id}`)
      : null;
  }

  ngOnInit(): void {
    if (this.thirdPartyUrl) {
      this.frameService.handleRequest(this.target, this.id, FrameMessageType.INIT, () => of(this.params));
      this.frameService.handleRequest(this.target, this.id, FrameMessageType.DICTIONARY, this.getDictionaryHandler());
      this.frameService.handleRequest(this.target, this.id, FrameMessageType.LOOKUP, this.getLookupHandler());
      this.canSubmit$.next(true);
    } else {
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

  private getDictionaryHandler(): any {
    return params => this.userDictionariesService.getDictionary(params.code);
  }

  private getLookupHandler(): any {
    return params => this.lookupService.lookup(params.code);
  }
}
