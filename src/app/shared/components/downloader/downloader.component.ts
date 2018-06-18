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
  @Input() name: string;
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
      .map(blobResponse => {
        const { navigator } = window;
        if (navigator && navigator.msSaveOrOpenBlob) {
          // IE doesn't want to save blobs via <a> tag
          navigator.msSaveOrOpenBlob(blobResponse.blob, this.name);
        } else {
          const href = URL.createObjectURL(blobResponse.blob);
          this.createLink(href, this.name || blobResponse.fileName).dispatchEvent(new MouseEvent('click'));
          URL.revokeObjectURL(href);
        }
      })
      .catch(error => {
        this.notificationsService.error('errors.default.download').entity(this.entityTranslationKey).response(error).dispatch();
        return empty();
      })
      .subscribe();
  }

  private createLink(href: string, name: string = ''): HTMLAnchorElement {
    const link: HTMLAnchorElement = this.renderer.createElement('a');
    this.renderer.setAttribute(link, 'href', href);
    this.renderer.setAttribute(link, 'download', name);
    return link;
  }
}
