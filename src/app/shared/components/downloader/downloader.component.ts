import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../core/data/data.service';

@Component({
  selector: 'app-downloader',
  templateUrl: './downloader.component.html'
})
export class DownloaderComponent {
  @Input() url: string;
  @Input() name: string;

  @ViewChild('link') link: ElementRef;

  href: string = null;

  constructor(private dataService: DataService) {}

  download(body: object): Observable<void> {
    return this.dataService.createBlob(this.url, {}, body)
      .map(blob => {
        this.href = URL.createObjectURL(blob);
        this.link.nativeElement.dispatchEvent([ new MouseEvent('click') ]);
        URL.revokeObjectURL(this.href = null);
      });
  }
}
