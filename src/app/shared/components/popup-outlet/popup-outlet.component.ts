import { trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { IPopup } from './popup-outlet.interface';

import { DynamicComponentLoader } from '@app/core/dynamic-loader/dynamic-loader.service';
import { PopupOutletService } from './popup-outlet.service';

import { fade, fly, withChildren } from '@app/shared/animations';

@Component({
  animations: [
    trigger('popupAnimation', fade([ withChildren('@popupContentAnimation') ])),
    trigger('popupContentAnimation', fly()),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-popup-outlet',
  styleUrls: [ 'popup-outlet.component.scss' ],
  templateUrl: 'popup-outlet.component.html',
})
export class PopupOutletComponent implements AfterViewInit {
  @Input() name = 'main';

  @ViewChild('outlet', { read: ViewContainerRef }) outlet: ViewContainerRef;

  isOpen = false;

  private current: ComponentRef<{}>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dynamicComponentLoader: DynamicComponentLoader,
    private popupService: PopupOutletService,
  ) {}

  get isLoaded(): boolean {
    return Boolean(this.current);
  }

  ngAfterViewInit(): void {
    this.popupService.popup.subscribe((popup: IPopup) => {
      if (popup && popup.outlet === this.name) {
        this.isOpen = true;
        this.cdRef.detectChanges();
        this.dynamicComponentLoader
          .getComponentFactory(popup.id)
          .subscribe(componentFactory => {
            this.current = this.outlet.createComponent(componentFactory, 0);
            this.cdRef.markForCheck();
          });
      } else {
        this.isOpen = false;
      }
    });
  }

  onClose(event: any): void {
    if (event.toState === 'void' && this.current) {
      this.current.destroy();
      this.current = null;
    }
  }

  close(): void {
    this.popupService.close();
  }
}
