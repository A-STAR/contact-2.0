import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { IImage } from './image-upload.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: [ './image-upload.component.scss' ],
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

  private image: IImage = null;

  private propagateChange: Function = () => {};

  constructor(
    private gridService: GridService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    if (this.url) {
      this.gridService
      .readBlob(this.url)
      .take(1)
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
  }

  get imageSrc(): SafeUrl {
    return this.image && this.image.size > 0 ?
      this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.image)) :
      null;
  }

  get actionButtonTitle(): string {
    return this.image && this.image.size > 0 ?
      'default.buttons.change' :
      'default.buttons.add';
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length) {
      this.image = files[0];
      this.propagateChange(this.image);
    }
  }

  onFileRemove(): void {
    this.image = false;
    this.propagateChange(this.image);
  }
}
