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
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';
import { TranslateService } from '@ngx-translate/core';

import { FrameMessageType } from '@app/shared/mass-ops/custom-operation/params/custom-operation-params.interface';
import { IAddOption } from '@app/shared/mass-ops/mass-operation.interface';
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

  @Input() addOptions: IAddOption[];
  @Input() id: number;
  @Input() key: string;
  @Input() params: ICustomOperationParams[];
  @Input() value: any;

  @ViewChild('frame') frame: ElementRef;
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  canSubmit = false;
  config: IDynamicLayoutConfig;

  private canSubmitSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private configService: ConfigService,
    private customOperationService: CustomOperationService,
    private domSanitizer: DomSanitizer,
    private frameService: FrameService,
    private lookupService: LookupService,
    private translateService: TranslateService,
    private userDictionariesService: UserDictionariesService,
  ) {}

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
      this.frameService.handleRequest(this.target, this.id, FrameMessageType.OPTIONS, () => of(this.addOptions));
      this.frameService.handleRequest(this.target, this.id, FrameMessageType.LANG, () => of(this.translateService.currentLang));
      this.frameService.handleRequest(this.target, this.id, FrameMessageType.DICTIONARY, this.getDictionaryHandler());
      this.frameService.handleRequest(this.target, this.id, FrameMessageType.LOOKUP, this.getLookupHandler());
      this.frameService.getRequest(this.id, FrameMessageType.VALIDATION).subscribe(message => {
        this.canSubmit = message.params.valid;
        this.cdRef.markForCheck();
      });
    } else {
      this.config = this.customOperationService.getActionInputParamsConfig(this.key, this.params);
    }
  }

  ngAfterViewInit(): void {
    if (this.layout) {
      this.canSubmitSub = this.layout.canSubmit()
        .subscribe(canSubmit => {
          this.canSubmit = canSubmit;
          this.cdRef.markForCheck();
        });
    }
    // Otherwise iframe gets reloaded on every cd cycle, e.g. when `canSubmit` changes
    if (this.thirdPartyUrl) {
      this.cdRef.detach();
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
