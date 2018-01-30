import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup-input',
  templateUrl: './popup-input.component.html',
})
export class PopupInputComponent {
  @Input() value: string;
  @Input() placeholder: string;

  @Output() action = new EventEmitter<void>();

  togglePopup(): void {
    this.action.emit();
  }
}
