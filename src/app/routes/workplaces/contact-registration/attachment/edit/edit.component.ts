import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-contact-registration-attachment-edit',
  templateUrl: './edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentEditComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls = [];

  onSubmit(): void {
    this.submit.emit();
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
