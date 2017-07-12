import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { IImage } from './image-upload.interface';

import { DataService } from '../../../../core/data/data.service';

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
  @Input() height = null as number;
  @Input() url = null as string;

  private image: IImage = null;

  private isDisabled = false;

  private propagateChange: Function = () => {};

  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    if (this.url) {
      this.dataService
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

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  get imageSrc(): SafeUrl {
    return this.image && this.image.size > 0 ?
      this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.image)) :
      null;
  }

  get displayButtons(): boolean {
    return !this.isDisabled;
  }

  get actionButtonTitle(): string {
    return this.image && this.image.size > 0 ?
      'default.buttons.change' :
      'default.buttons.add';
  }

  get style(): any {
    return {
      height: this.height ? `${this.height}px` : 'auto'
    };
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
