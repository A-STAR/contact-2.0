import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/combineLatest';

import { GridService } from '../../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-form-image',
  templateUrl: './image.component.html',
  styleUrls: [ './image.component.scss' ]
})
export class FormImageComponent implements OnInit {
  @Input() url = null as string;

  imageSrcUrl$: Observable<string>;

  actionButtonTitle$: Observable<string>;

  private preview$ = new Subject<File | Blob>();

  constructor(
    private http: AuthHttp,
    private gridService: GridService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.imageSrcUrl$ = this.preview$
      .map(data => data && data.size ? this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data)) : null);

    this.actionButtonTitle$ = this.preview$
      .map(data => data && data.size ? 'default.buttons.change' : 'default.buttons.add');

    this.gridService
      .readBlob(this.url)
      .take(1)
      .subscribe(blob => this.preview$.next(blob));
  }

  // TODO(d.maltsev): somehow clear file input after upload so that it would be possible to upload same file twice
  onFileChange(event: any): void {
    this.preview$.next(event.target.files[0]);

    const data = new FormData();
    data.append('file', event.target.files[0]);

    this.gridService
      .create(this.url, {}, data)
      .take(1)
      .subscribe(
        // TODO(d.maltsev): notification
      );
  }

  onFileRemove(): void {
    this.gridService
      .delete(this.url)
      .take(1)
      .subscribe(
        () => this.preview$.next(null)
        // TODO(d.maltsev): notification
      );
  }
}
