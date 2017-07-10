import { ChangeDetectionStrategy, Component, Input, Renderer2 } from '@angular/core';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Component({
  selector: 'app-downloader',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloaderComponent {
  @Input() errorTranslationKey: string;
  @Input() name: string;
  @Input() url: string;

  constructor(
    private notificationsService: NotificationsService,
    private dataService: DataService,
    private renderer: Renderer2,
  ) {}

  download(body: object = {}): void {
    // this.dataService.createBlob(this.url, {}, body)
    this.dataService.readBlob(this.url, {})
      .map(blob => {
        const href = URL.createObjectURL(blob);
        this.createLink(href, this.name).dispatchEvent(new MouseEvent('click'));
        URL.revokeObjectURL(href);
      })
      // TODO(d.maltsev): refactor once we are able to handle server error messages
      .catch(error => {
        this.notificationsService.error(this.errorTranslationKey);
        throw error;
      })
      .subscribe();
  }

  private createLink(href: string, name: string): any {
    const link = this.renderer.createElement('a');
    this.renderer.setAttribute(link, 'href', href);
    this.renderer.setAttribute(link, 'download', name);
    return link;
  }
}
