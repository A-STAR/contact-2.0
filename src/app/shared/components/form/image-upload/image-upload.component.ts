import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { GridService } from '../../../../shared/components/grid/grid.service';

type IImage = File | Blob | false;

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ]
})
export class ImageUploadComponent implements ControlValueAccessor, OnInit {
  @Input() url = null as string;

  private _image: IImage = null;

  private propagateChange: Function = () => {};
  private propagateTouched: Function = () => {};

  constructor(
    private gridService: GridService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    if (this.url) {
      this.downloadImage(this.url)
        .subscribe(image => this.image = image);
    }
  }

  writeValue(image: IImage): void {
    this.image = image;
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouched = fn;
  }

  get imageSrc(): SafeUrl {
    return this.image && this.image.size > 0 ?
      this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.image)) :
      null;
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length) {
      this.image = files[0];
    }
  }

  onFileRemove(): void {
    this.image = false;
    this.propagateChange(this.image);
  }

  private get image(): IImage {
    return this._image;
  }

  private set image(image: IImage) {
    this._image = image;
    this.propagateChange(this.image);
  }

  private downloadImage(url: string): Observable<Blob> {
    return this.gridService
      .readBlob(url)
      .take(1);
  }
}
