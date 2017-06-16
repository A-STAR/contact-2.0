import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Action } from '@ngrx/store';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Component({
  selector: 'app-form-image',
  templateUrl: './image.component.html',
  styleUrls: [ './image.component.scss' ]
})
export class FormImageComponent implements OnInit, OnDestroy {
  @Input() action: (file: File | false) => Action;
  @Input() url = null as string;

  @ViewChild('file') fileInput: ElementRef;

  hasImage = false;

  src = null as SafeUrl;

  actionButtonTitle = null as string;

  private preview$ = new Subject<File | Blob>();

  private previewSubscription: Subscription;

  constructor(
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    // Async pipe doesn't work on image src with ngIf
    // Possible solution - use placeholder images instead of hiding with ngIf
    this.previewSubscription = this.preview$
      .subscribe(data => {
        this.hasImage = data && data.size > 0;
        this.src = this.hasImage ? this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data)) : null;
        this.actionButtonTitle = this.hasImage ? 'default.buttons.change' : 'default.buttons.add';
      });

    if (this.url) {
      this.gridService
        .readBlob(this.url)
        .take(1)
        .subscribe(blob => this.preview$.next(blob));
    }
  }

  ngOnDestroy(): void {
    this.previewSubscription.unsubscribe();
  }

  // TODO(d.maltsev): clear file input after upload
  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length) {
      this.changePreview(files[0]);
    }
  }

  onFileRemove(): void {
    this.changePreview(null);
  }

  private changePreview(file: File): void {
    this.preview$.next(file);
    this.action(file || false);
  }
}
