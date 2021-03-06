import { ChangeDetectionStrategy, Component, Input, Renderer2 } from '@angular/core';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { empty } from 'rxjs/observable/empty';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-downloader',
  template: '',
})
export class DownloaderComponent {
  @Input() entityTranslationKey: string;

  /**
   * Now that the server sends file name in headers, `name` input is no longer necessary.
   * It has been replaced with `fallbackName` for compatibility reasons.
   */
  @Input() fallbackName: string;
  @Input() url: string;

  constructor(
    private notificationsService: NotificationsService,
    private dataService: DataService,
    private renderer: Renderer2,
  ) {}

  download(body: object = null): void {
    const request = body
      ? this.dataService.createBlob(this.url, {}, body)
      : this.dataService.readBlob(this.url, {});

    request
      .map(response => {
        const { navigator } = window;
        const fileName = response.name || this.fallbackName;
        if (navigator && navigator.msSaveOrOpenBlob) {
          // IE doesn't want to save blobs via <a> tag
          navigator.msSaveOrOpenBlob(response.blob, fileName);
        } else {
          const href = URL.createObjectURL(response.blob);
          this.createLink(href, fileName).dispatchEvent(new MouseEvent('click'));
          URL.revokeObjectURL(href);
        }
      })
      .catch(error => {
        this.notificationsService.error('errors.default.download').entity(this.entityTranslationKey).response(error).dispatch();
        return empty();
      })
      .subscribe();
  }

  private createLink(href: string, name: string): HTMLAnchorElement {
    const link: HTMLAnchorElement = this.renderer.createElement('a');
    this.renderer.setAttribute(link, 'href', href);
    this.renderer.setAttribute(link, 'download', name);
    return link;
  }
}
