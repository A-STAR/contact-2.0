import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionDialogComponent {

  @Input() autoWidth = true;
  @Input() titleTranslationParams: any;
  @Input() titleTranslationKey: string;
  @Input() cancelTranslationKey = 'default.buttons.cancel';
  @Input() actionTranslationKey = 'default.buttons.save';
  @Input() actionMode = 'success';
  @Input() canSubmit = true;
  @Input() styles = {} as CSSStyleDeclaration;

  @Output() action = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }

  onCancel(): void {
    this.close();
  }

  private close(): void {
    this.cancel.emit();
  }
}
