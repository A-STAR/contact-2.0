import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-form-image',
  templateUrl: './image.component.html',
  styleUrls: [ './image.component.scss' ]
})
export class FormImageComponent implements OnInit {
  @Input() url = null as string;
  @Input() size = 120;

  imageSrcUrl$: Observable<string>;

  actionButtonTitle$: Observable<string>;

  constructor(
    private gridService: GridService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.imageSrcUrl$ = this.gridService
      .readBlob(this.url)
      .map(data => data.size ? this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data)) : null);

    this.actionButtonTitle$ = this.imageSrcUrl$
      .map(url => url ? 'default.buttons.change' : 'default.buttons.add');
  }
}
