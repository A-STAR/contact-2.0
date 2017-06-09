import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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

  preview$ = new Subject<File | Blob>();

  actionButtonTitle$: Observable<string>;

  constructor(
    private gridService: GridService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.imageSrcUrl$ = this.preview$
      .map(data => {
        console.log(data);
        console.log(URL.createObjectURL(data));
        return data.size ? this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data)) : null;
      });

    // this.actionButtonTitle$ = this.preview$
    //   .map(url => url ? 'default.buttons.change' : 'default.buttons.add');

    this.gridService
      .readBlob(this.url)
      .take(1)
      .subscribe(blob => this.preview$.next(blob));
  }

  onFileChange(event: any): void {
    this.preview$.next(event.target.files[0]);
  }
}
