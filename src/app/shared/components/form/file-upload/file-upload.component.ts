import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: [ './file-upload.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadComponent implements ControlValueAccessor, Validator {
  @Input() fileName: string;
  @Input() isRequired = false;

  private file: File;

  isDisabled = false;

  writeValue(file: File): void {
    this.file = file;
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  get displayFileName(): string {
    return this.file ? this.file.name : this.fileName;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.file = file;
    this.propagateChange(file);
  }

  validate(): any {
    switch (true) {
      case this.isRequired && !this.displayFileName:
        return { required: true };
      default:
        return null;
    }
  }

  private propagateChange: Function = () => {};
}
