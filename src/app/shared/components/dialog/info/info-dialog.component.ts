import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoDialogComponent {

  @Input() titleTranslationParams;
  @Input() titleTranslationKey: string;
  @Input() actionTranslationKey = 'default.buttons.close';
  @Input() actionMode = 'info';

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
