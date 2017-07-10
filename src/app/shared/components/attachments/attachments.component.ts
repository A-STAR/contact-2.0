import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IAttachment } from './attachments.interface';
import { IGridColumn } from '../grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../toolbar-2/toolbar-2.interface';

import { DownloaderComponent } from '../downloader/downloader.component';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html'
})
export class AttachmentsComponent {

  @Input() attachments$: Observable<Array<IAttachment>>;
  @Input() multiple = false;

  @Output() onFetch = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<IAttachment>();
  @Output() onUpload = new EventEmitter<Array<File>>();

  @ViewChild('downloader') downloader: DownloaderComponent;
  @ViewChild('input') input: ElementRef;

  private selectedDocument$ = new BehaviorSubject<IAttachment>(null);

  columns: Array<IGridColumn> = [
    { prop: 'type', minWidth: 100, maxWidth: 200 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'description', minWidth: 300 },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_UPLOAD,
      action: () => this.upload()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DOWNLOAD,
      action: () => this.download(),
      enabled: this.selectedDocument$.map(Boolean)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.delete(),
      enabled: this.selectedDocument$.map(Boolean)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.refresh(),
    },
  ];

  get name$(): Observable<string> {
    return this.selectedDocument$
      .map(document => document && document.name)
      .distinctUntilChanged();
  }

  get url$(): Observable<string> {
    return this.selectedDocument$
      .map(document => document && document.url)
      .distinctUntilChanged();
  }

  onDoubleClick(document: IAttachment): void {
    this.downloadSelectedAttachment();
  }

  onSelect(document: IAttachment): void {
    this.selectedDocument$.next(document);
  }

  onFileChange(event: Event): void {
    const { files } = event.target as any;
    this.onUpload.emit(files);
  }

  upload(): void {
    this.input.nativeElement.click();
  }

  download(): void {
    this.downloadSelectedAttachment();
  }

  delete(): void {
    this.onDelete.emit(this.selectedDocument$.value);
  }

  refresh(): void {
    this.onFetch.emit();
  }

  private downloadSelectedAttachment(): void {
    this.downloader.download();
  }
}
